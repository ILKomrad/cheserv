const Checkers = require('./checkers');

class Giveaway extends Checkers {
    constructor(type) {
        super(type);

        this.paths = [
            [0, 0, 0, 2, 0, 2, 0, 2],
            [0, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
    }
}

module.exports = Giveaway;