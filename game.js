const Giveaway = require('./games/giveaway');

class Game {
    constructor(model) {
        this.model = model;
        this.gameGenerator = new GameGenerator();
    }

    getMeeting(playerId) {
        return this.model.getMeeting(playerId);
    }

    newMeeting(gameType, player) {
        const game = this.gameGenerator.getGame(gameType);
        game.addPlayer(player);
        
        return new Promise((res, rej) => {
            this.model.addGame(game)
            .then(gameId => {
                return this.model.addMeeting({
                    type: gameType,
                    score: {id: player.id, name: player.name, category: player.category, score: 0},
                    games: [gameId],
                    firstPlayer: player.id
                });
            })
            .then(meeting => {
                res(meeting);
            })
        });
    }
}

class Meeting {
    constructor(id, type, isStart, score) {
        this.id = id;
        this.isStart = 0;
        this.type = type;
        this.score = score;
        this.games = [];
    }

    addGame(id) {
        this.games.push(id);
    }
}

class GameGenerator {
    constructor() {
        this.giveaway = new Giveaway();
    }

    getGame(type) {
        switch (type) {
            case 'giveaway':
                return new Giveaway(type);
                break;
            default:
                return '';
                break;
        }
    }
}

module.exports = Game;