// var socket_io = require('socket.io');
// var io = socket_io();

const io = require('socket.io')();
const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');

    // create socket with current user in order to send him realltime notifications
    socket.on('userid', (userid) => {
        socket.join(userid);
    });

    // create a room 
    socket.on('roomid', (roomid) => {
        socket.join(roomid);
    });

    socket.on('typing', (data) => {
        console.log(data);
        io.in(data.room).emit('typing', { 
            isTyping: true,
            user: data.user
        });
    });
});

// socketApi.sendNotification = function() {
//     io.sockets.emit('hello', {msg: 'Hello World!'});
// }

module.exports = socketApi;