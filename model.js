var fetch = require('node-fetch');

class Model {
    constructor() {
        this.url = 'http://localhost:8888/checkers/index.php';
        this.fetch = fetch;
    }

    login(id, socketId) {
        return this.sendPost({
            login: id,
            socketId
        })
        .then(resp => resp.text())
    }

    logout(playerId, socketId) {
        return this.sendPost({
            logout: {
                playerId,
                socketId
            }
        })
        .then(resp => resp.text())
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

    selectMeeting(meetingId, playerId) {
        return this.sendPost({
            selectMeeting: {meetingId, playerId}
        })
        .then(resp => resp.text())
    }

    findMeeting(meetingId) {
        let url = this.url + '?action=findMeeting&id=' + meetingId;

        return this.fetch(url)
            .then(res => res.text())
    }

    addGame(game) {
        return this.sendPost({
            addGame: game
        })
        .then(resp => resp.text())
    }

    getGame(id) {
        console.log('id', id);
        return this.fetch(this.url + '?action=getGame&id=' + id)
        .then(resp => resp.text());
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

    findPlayerById(id) {
        return this.fetch(this.url + '?action=findPlayerById&id=' + id)
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