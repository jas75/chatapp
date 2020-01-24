const io = require('socket.io')();
const Relationship = require('./../app/models/relationship');
const Message = require('./../app/models/message');
const socketApi = {};
const logger = require('./../../utils/logger');

socketApi.io = io;

socketApi.io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // create socket  with current user in order to send him realltime notifications
    socket.on('userid', (userid) => {
        logger.info(`Socket connected with user ${userid}`);
        socket.join(userid);
        //socket.userid = userid;
    });

    // create a room 
    socket.on('join-room', (roomid) => {     
        if (socket.room) {
            // console.log("before leaving: Is client still in "+ socket.room + " (should be true)")
            // console.log(io.sockets.adapter.sids[socket.id][socket.room]);
            socket.leave(socket.room, (err) => {
                if (err) {
                    logger.error(err);
                } else { 
                    logger.info(`Socket left room ${socket.room}`);
                }
            });
        } 
        // console.log("Before joining: is client in room " + roomid + " (should be undefined)");
        // console.log(io.sockets.adapter.sids[socket.id][roomid]);
        socket.join(roomid, (err) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info(`Socket joined room ${roomid}`);
                socket.room = roomid;
            }
        });

    });

    socket.on('message', (data) => {
        Relationship.findById(data.room_id)
        .then(relationship => {
            logger.info(`Saving message "${data.content}" in DB`);
            const message = new Message({
                sender: data.sender_id,
                content: data.content
            });
            relationship.messages.push(message);
            return relationship.save();
        })
        .then(() => {
            logger.info(`${data.sender_id} sent socket message in room: ${data.room_id}`);
            console.log("ET LA IL EMITE LE MESSAGE")
            io.sockets.in(data.room_id).emit('message', {
                debug: socket.nsp.name,
                sender_id: data.sender_id,
                content: data.content
            });
        })
        .catch(err => logger.error(err));
    });

    socket.on('typing', (data) => {
        const isTyping = data.input && data.input.length > 0 ? true : false;
        //logger.info(`User ${data.user} is typing in room: ${data.room}`);
        io.in(data.room).emit('typing', { 
            isTyping: isTyping,
            user: data.user
        });
    });
});

// socketApi.sendNotification = function() {
//     io.sockets.emit('hello', {msg: 'Hello World!'});
// }

module.exports = socketApi;