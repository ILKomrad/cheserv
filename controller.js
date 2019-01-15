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

    getMeetingById(id) {
        return new Promise(res => {
            this.players.findPlayerById(id)
            .then(data => {
                const player = JSON.parse(data);
                return this.game.findMeeting(player.currentMeetingId);
            })
            .then(meeting => {
                const data = JSON.parse(meeting),
                    games = JSON.parse(data.games);

                return Promise.all([
                    this.game.getGame(games[games.length - 1]),
                    Promise.resolve(meeting)
                ]);
            })
            .then(data => {
                res(JSON.stringify({
                    game: data[0],
                    meeting: data[1]
                }));
            })
        })
    }

    getMeeting(playerId) {
        return this.game.getMeeting(playerId);
    }

    newMeeting(data) {
        return new Promise((res, rej) => {
            this.checkAuth(data.token)
            .then(player => {
                if (!player.error) {
                    const user = JSON.parse(player.user);
                    return Promise.all([this.game.newMeeting(data.gameType, user), Promise.resolve(user.id)]);
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

    selectMeeting(meetingId, userId) {
        return new Promise(res => {
            this.game.selectMeeting(meetingId, userId)
            .then(d => this.game.findMeeting(meetingId))
            .then(data => {
                const meeting = JSON.parse(data);
                this.players.setMeeting(userId, meeting);

                return Promise.all([
                    this.players.findPlayerById(meeting.firstPlayer), 
                    Promise.resolve(meeting)
                ]);
            })
            .then(data => { 
                const firstPlayer = JSON.parse(data[0]),
                    meeting = data[1];
                
                res({firstPlayer: firstPlayer['socketId'], meeting});
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

    login(data, sessionTime, socketId) { 
        return new Promise((res, rej) => {
            this.players.getPlayer(data.email)
            .then(e => {
                const player = JSON.parse(e);

                if (player.password === data.password) {
                    const token = jwt.sign(player, this.secretKey, {expiresIn: sessionTime}); //make token
                    this.players.login(player.id, socketId)
                    .then(e => {
                        if (e) { //ok
                            res({token, player});
                        } else {
                            rej('Data base error');
                        }
                    })
                } else {
                    rej('Password invalid');
                }
            })
            .catch(error => {
                rej(error); //getPlayer return error === player not found
            })
        });
    }

    logout(playerId, socketId) {
        this.players.logout(playerId, socketId);
    }

    checkAuth(token, socketId) {
        return new Promise(res => {
            try {
                const decoded = jwt.verify(token, this.secretKey);
                this.players.getPlayer(decoded.email)
                .then((player) => { //ok
                    this.players.login(decoded.id, socketId);
                    res({token: token, user: player});
                })
                .catch((err) => { //decoded email in base is not find or player was deleted
                    res({error: {message: err}});
                });
            } catch (err) { //invalid token
                if (err.message === 'jwt expired') {

                }
                res({error: err});
            }
        })
    }
}

module.exports = (model, secretKey) => new Controller(model, secretKey);