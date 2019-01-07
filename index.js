var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    port = process.env.PORT || 3000,
    secretKey = 'checkers-checkers-checkers-checkers-secret',
    model = require('./model.js'),
    controller = require('./controller.js')(model, secretKey);
    bodyParser = require('body-parser'),
    sessionTime = '2h'; //60 = 1minute '2h' - 2hours

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname));

io.on('connection', function(socket) {
    console.log('connect');
    socket.on('auth', (data) => {
        controller.login(data, sessionTime)
        .then(e => {
            socket.emit('authResult', {user: e.player, token: e.token});
        })
        .catch(e => {
            socket.emit('authResult', {error: e});
        })
    });

    socket.on('checkAuth', (data) => {
        controller.checkAuth(data.token)
        .then(d => {
            socket.emit('authResult', d);
        });
    });

    socket.on('checkIn', (data) => {
        controller.checkIn(data)
        .then((data) => {
            socket.emit('checkInResult', data);
        })
    });

    socket.on('getPlayers', () => {
        controller.getPlayers()
        .then(body => socket.emit('hello', body));
    });

    socket.on('getMeeting', ({playerId}) => {
        controller.getMeeting(playerId)
        .then(body => socket.emit('hello', body));
    });

    socket.on('newMeeting', (data) => {
        controller.newMeeting(data)
        .then(data => {
            socket.emit('meetingAdded', data);
            socket.broadcast.emit('newMeetingAdded', data.meeting);
        })
        .catch(data => {
            socket.emit('meetingAdded', false);
        })
    });
});

http.listen(port, () => {
    console.log( port );
});