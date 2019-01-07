var fetch = require('node-fetch');

class Model {
    constructor() {
        this.url = 'http://localhost:8888/checkers/index.php';
        this.fetch = fetch;
    }

    getMeeting() {
        return new Promise((res, rej) => {
            this.fetch(this.url + '?action=getMeeting')
            .then(res => res.text())
            .then(body => res(body));
        });
    }

    addMeeting(meeting) {
        return new Promise((res, rej) => {
            this.sendPost({
                addMeeting: meeting
            })
            .then(resp => resp.text())
            .then(meetingId => {
                meeting.id = meetingId;
                res(meeting);
            });
        });
    }

    addGame(game) {
        return new Promise((res, rej) => {
            this.sendPost({
                addGame: game
            })
            .then(resp => resp.text())
            .then(gameId => res(gameId));
        })
    }

    addPlayer(player) {
        return new Promise((res, rej) => {
            this.sendPost({
                addPlayer: player
            })
            .then(resp => resp.text())
            .then(body => res(!!body));
        });
    }

    getPlayer(email) {
        return this.fetch(this.url + '?action=getPlayer&email=' + email)
        .then(e => e.text())
    }

    setCurrentMeetingId(playerId, meetingId) {
        return new Promise((res, rej) => {
            this.sendPost({
                setCurrentMeetingId: {playerId, meetingId}
            })
            .then(resp => resp.text())
            .then(body => res(!!body));
        });
    }

    sendPost(data) {
        return this.fetch(this.url, {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }
}

module.exports = new Model();