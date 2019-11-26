// var socket_io = require('socket.io');
// var io = socket_io();

const io = require('socket.io')();
const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');
});

// socketApi.sendNotification = function() {
//     io.sockets.emit('hello', {msg: 'Hello World!'});
// }

module.exports = socketApi;