var fetch = require('node-fetch');

class Model {
    constructor() {
        this.url = 'http://localhost:8888/checkers/index.php';
        this.fetch = fetch;
    }

    getMeeting(playerId) {
        let url = this.url + '?action=getMeeting';

        if (playerId) {
            url += '&playerId=' + playerId;
        }
        return this.fetch(url)
            .then(res => res.text())
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
        return this.sendPost({
            addGame: game
        })
        .then(resp => resp.text())
    }

    addPlayer(player) {
        return this.sendPost({
            addPlayer: player
        })
        .then(resp => resp.text())
    }

    getPlayer(email) {
        return this.fetch(this.url + '?action=getPlayer&email=' + email)
        .then(e => e.text())
    }

    setCurrentMeetingId(playerId, meetingId) {
        return this.sendPost({
            setCurrentMeetingId: {playerId, meetingId}
        })
        .then(resp => resp.text())
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