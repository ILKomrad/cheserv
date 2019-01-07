class Checkers {
    constructor(type) {
        this.paths = [];
        this.type = type;
        this.cells = [
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w']]; 
        this.hitsChips = {
            1: [],
            2: []}
        this.whoseTurn = 1;
        this.whoWin = null;
        this.players = [];
    }

    setId(id) {
        this.id = id;
    }

    addPlayer(player) {
        this.players.push(player);
    }
}

module.exports = Checkers;