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
    sessionTime = '365d'; //60 = 1minute '2h' - 2hours

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname));

io.on('connection', function(socket) {
    console.log('connect', socket.id);
    socket.on('auth', (data) => {
        controller.login(data, sessionTime, socket.id)
        .then(e => {
            socket.emit('authResult', {user: e.player, token: e.token});
        })
        .catch(e => {
            socket.emit('authResult', {error: e});
        })
    });

    socket.on('logout', (data) => {
        controller.logout(data.id, socket.id);
    });

    socket.on('checkAuth', (data) => {
        controller.checkAuth(data.token, socket.id)
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

    socket.on('getMeetingById', ({playerId}) => {
        controller.getMeetingById(playerId)
        .then(body => socket.emit('gameHello', body));
    })

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

    socket.on('selectMeeting', (data) => {
        controller.selectMeeting(data.id, data.userId)
        .then(data => {
            socket.to(data.firstPlayer).emit('opponent_step', JSON.stringify(data.meeting));
            socket.emit('opponent_step', JSON.stringify(data.meeting));
        });
    });

    socket.on('disconnect', function() {
        controller.logout(null, socket.id)
    });
});

http.listen(port, () => {
    console.log( port );
});