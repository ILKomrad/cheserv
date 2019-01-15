class Players {
    constructor(model) {
        this.model = model;
    }

    getPlayers() {
        return new Promise((res, rej) => {
            this.model.getMeeting()
            .then(body => res(body));
        });
    }

    addPlayer(player) {
        return new Promise((res, rej) => {
            this.model.addPlayer(player)
            .then(data => res(!!data))
        });
    }

    findPlayerById(id) {
        return this.model.findPlayerById(id);
    }

    getPlayer(email) {
        return new Promise((res, rej) => {
            this.model.getPlayer(email)
            .then(player => {
                if (player) {
                    res(player)
                } else {
                    rej('not found');
                }
            });
        });
    }

    login(id, socketId) {
        return this.model.login(id, socketId);
    }

    logout(playerId, socketId) {
        return this.model.logout(playerId, socketId)
    }

    setMeeting(playerId, meeting) {
        return new Promise(res => {
            this.model.setCurrentMeetingId(playerId, meeting.id)
            .then(() => res({playerId, meeting}));
        });
    }
}

module.exports = Players;