const Players = require('./players.js');
const Game = require('./game.js');
const jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt');

class Controller {
    constructor(model, secretKey) {
        this.model = model;
        this.secretKey = secretKey;
        this.players = new Players(model);
        this.game = new Game(model);
    }

    getMeeting(playerId) {
        return this.game.getMeeting(playerId);
    }

    newMeeting(data) {
        return new Promise((res, rej) => {
            this.checkAuth(data.token)
            .then(player => {
                if (!player.error) {
                    return Promise.all([this.game.newMeeting(data.gameType, player.user), Promise.resolve(player.user.id)]);
                } else {
                    rej(false);
                }
            })
            .then(data => { 
                if (data) { //set currentMeetingId at player
                    return this.players.setMeeting(data[1], data[0]);
                }
            })
            .then(data => {
                res(data); //{playerId, meeting}
            });
        })
    }

    getPlayers() {
        return this.players.getPlayers();
    }

    checkIn(data) {
        return new Promise(res => {
            this.players.getPlayer(data.email)
            .then(player => res('email exist'))
            .catch(err => {
                this.players.addPlayer(data)
                .then(e => res(e))
            });
        });
    }

    login(data, sessionTime) { 
        return new Promise((res, rej) => {
            this.players.getPlayer(data.email)
            .then(e => {
                const player = JSON.parse(e);

                if (player.password === data.password) {
                    const token = jwt.sign(player, this.secretKey, {expiresIn: sessionTime});
                    res({token, player});
                } else {
                    rej('Password invalid');
                }
            })
            .catch(error => {
                rej(error);
            })
        });
    }

    checkAuth(token) {
        return new Promise(res => {
            try {
                const decoded = jwt.verify(token, this.secretKey);
                this.players.getPlayer(decoded.email)
                .then(() => { // ok
                    res({token: token, user: decoded});
                })
                .catch((err) => { //decoded email in base is not find or player was deleted
                    res({error: {message: err}});
                });
            } catch (err) { //invalid token
                res({error: err});
            }
        })
    }
}

module.exports = (model, secretKey) => new Controller(model, secretKey);