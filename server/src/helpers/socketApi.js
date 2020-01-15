const io = require('socket.io')();
const Relationship = require('./../app/models/relationship');
const Message = require('./../app/models/message');
const socketApi = {};
const logger = require('./../../utils/logger');

socketApi.io = io;

io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // create socket with current user in order to send him realltime notifications
    socket.on('userid', (userid) => {
        logger.info(`Socket connected with user ${userid}`);
        socket.join(userid);
    });

    // create a room 
    socket.on('roomid', (roomid) => {
        logger.info(`Socket connected with room ${roomid}`);
        socket.join(roomid);
    });

    socket.on('typing', (data) => {
        logger.info(`Socket detected typing from ${data.user}`);
        const isTyping = data.input && data.input.length > 0 ? true : false;
        logger.info(`Socket emit in room ${data.room} that user is typing`);
        io.in(data.room).emit('typing', { 
            isTyping: isTyping,
            user: data.user
        });
    });

    socket.on('message', (data) => {

        Relationship.findById(data.room_id)
        .then(relationship => {
            const message = new Message({
                sender: data.sender_id,
                content: data.content
            });
            relationship.messages.push(message);
            return relationship.save();
        })
        .then(() => {
            console.log('il passe la');
            io.in(data.room_id).emit('message', {
                sender_id: data.sender_id,
                content: data.content
            });
        })
        .catch(err => logger.err(err));
    });
});

// socketApi.sendNotification = function() {
//     io.sockets.emit('hello', {msg: 'Hello World!'});
// }

module.exports = socketApi;