const User = require('./../models/user');
const Relationship = require('./../models/relationship');
const Message = require('../models/message');
const logger = require('./../../../utils/logger');

exports.sendFriendRequest = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ status: 'Unauthorized', msg: 'Forbidden' });
  }

  if (!req.body.recipient) { 
    logger.warn('Missing payload parameters');
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong'});
  }

  if(req.user._id === req.body.recipient) {
    logger.warn('User trying to add himself');
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong'});
  }

  Relationship.find({ $or: [
    { sender: req.user._id, recipient: req.body.recipient },
    { recipient: req.user._id, sender: req.body.recipient }
  ]})
  .then(relation => {
        if (relation.length > 0) {
          logger.warn('Relation already exists');
          throw {
            error: new Error(),
            status: 409,
            statusmsg: 'Conflict',
            msg: 'Relation already exists'
          };
        }

        const message = new Message({
          sender: req.user._id,
          content: `Hey, would you like to be my friend ?`,
          dateCreation: Date.now()
        });

        const relationship = new Relationship({
          sender: req.user._id,
          recipient: req.body.recipient,
          areFriends: false,
          messages: message
        });

        return relationship.save();
   })
   .then(friendrequest => {
        logger.info(friendrequest.sender + ' sent a friend request to ' + friendrequest.recipient);
        req.io.sockets.in(friendrequest.recipient).emit('friend-request');
        return res.status(201).json({ status: 'OK', msg: 'Friend Request sent' });
   })
   .catch(err => {
        logger.error(err.msg);
        return res.status(err.status).json({ status: err.statusmsg, msg: err.msg });
   });
};

// delete a Relationship
exports.removeContact = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Forbidden' });
  }

  if (!req.params.sender_id) {
    logger.warn('Missing parameters');
    return res.status(400).json({ msg: 'Something went wrong' });
  }

  logger.info(`Searching for ${req.user._id}`);

  User.findOne({ _id: req.user._id })
  // Remove the ids on the friends array of User 
  .then(doc => {
    logger.info(`Found ${doc.email}`);
    doc.friends = doc.friends.filter(el => {
      el._id === req.body.idToDelete;
    });
    return doc.save();
  })
  .then(() => {
    logger.info(`Searching for ${req.params.sender_id}`);
    return User.findOne({ _id: req.params.sender_id });
  })
  .then(doc2 => {
    logger.info(`Found ${doc2.email}`);
    doc2.friends = doc2.friends.filter(el => {
      el._id === req.user._id;
    });
    return doc2.save();
  })
  // Then delete the Relationship
  .then(() => {
    return Relationship.deleteOne({ $or: [
      { sender: req.user._id, recipient: req.params.sender_id },
      { sender: req.params.sender_id, recipient: req.user._id }
    ]});
  })
  .then(relation => {
    // if deletedCount is > 0 then relationship was deleted
    if (relation.deletedCount > 0) {
      logger.info(`${req.user._id} blocked ${req.params.sender_id}`);
      req.io.sockets.in(req.params.sender_id).emit('deny-friend-request');
      return res.status(200).json({ status: "Ok", msg: 'Connection successfullly removed'});
    }
    logger.warn(`${req.user._id} and ${req.params.sender_id} are not friends`);
    return res.status(400).json({ status: 'Bad Request', msg: 'Relationship does not exist'});
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong'});
  });
};


exports.getOneOrManyUsers = (req, res) => {
  if (!req.params.email) {
    logger.warn('Missing parameter');
    return res.status(400).json({ status: 'Bad Request', msg: 'Missing email'});
  }

  if (req.params.email.length < 3) {
    logger.warn('Query string under 3 characters');
    return res.status(400).json( { status: 'Bad Request', msg: 'Enter at least 3 characters'});
  }

  User.find({ $or: [
    { email: { $regex: '.*' + req.params.email + '.*', $ne: req.user.email } },
    { username: { $regex: '.*' + req.params.email + '.*', $ne: req.user.username } }
  ]})
  .then(users => {
    if (users.length <= 0) {
      logger.info('Didn\'t find any user for these refs');
      return res.status(204).send();
    }
    
    // check if users are friend with current user
    let usersMap = users.map(user => {
      return Relationship.findOne({ $or: [
        { sender: req.user._id, recipient: user._id },
        { sender: user._id, recipient: req.user._id }
      ]})
      .lean()
      .then(relationship => {
        let relationshipExists;
        relationship ? relationshipExists = true : relationshipExists = false;
        let jsonUser = user.toJSON();
        jsonUser.relationshipExists = relationshipExists;
        return jsonUser;
      });
    });

    Promise.all(usersMap)
    .then(results => {
      console.log(results);
      logger.info(`${users.length} user matching`);
      return res.status(200).json({ status: 'OK', users: results });
    });
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong' });
  });
};

exports.acceptFriend = (req, res) => {
  
  if (!req.body.sender) {
    logger.warn('Missing parameters');
    return res.status(400).json({ msg: 'Something went wrong'});
  }

  let sender1;
  let recipient1;

  Relationship.findOne({ $or: [
    { sender: req.user._id, recipient: req.body.sender },
    { sender: req.body.sender, recipient: req.user._id }
  ]})
  .then(relation => {
    if (!relation) {
      logger.warn(`No Relationship found for ${req.body.sender} and ${req.user._id}`);
      return res.status(400).json({ status: 'Bad Request', msg: 'There is no relationship'});
    }

    if (relation.areFriends === true) {
      logger.warn(`${req.body.sender} and ${req.user._id} already friends`);
      return res.status(400).json({ status: 'Bad Request', msg: 'You are already friends' });
    }
    relation.areFriends = true;
    return relation.save();
  })
  .then(response => {
    logger.info(`Relationship with id ${response._id} has now property areFriends set to true`);
    return User.findOne({ _id: req.body.sender });
  })
  .then(sender => {
    sender1 = sender;
    sender.friends.push(req.user._id);
    return sender.save();
  })
  .then(() => {
    logger.info(`User ${sender1.email} has now ${req.user._id} in friends array`);
    return User.findOne({ _id: req.user._id });
  })
  .then(recipient => {
    recipient1 = recipient;
    recipient.friends.push(req.body.sender);
    return recipient.save();
  })
  .then(() =>{
    logger.info(`User ${recipient1.email} has now ${req.body.sender} in friends array`);
    logger.info(`${sender1.email} and ${recipient1.email} are now friends`);
    req.io.in(req.body.sender).emit('accept-friend-request');
    return res.status(201).json({ status: 'Created', msg: `You are now friend with ${sender1.email}`});
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong' });
  });
};

// get one relationship matching with two user ids
exports.getRelationshipByIds = (req, res) => {
  if (!req.params.id) {
    logger.warn('Missing payload parameters');
    return res.status(400).json({ status: 'Bad Request', msg: 'Missing id '});
  }

  Relationship.findOne({ $or: [
    { sender: req.user._id, recipient: req.params.id },
    { sender: req.params.id, recipient: req.user._id }
  ]})
  .then(relationship => {
    if (!relationship) {
      logger.warn(`Did't find any Relationship`);
      return res.status(204).send();
    }
    logger.info(`Relationship exists: ${relationship._id}`);
    return res.status(200).json({ status: 'OK', relationship: relationship });
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong'});
  });
};

// TODO test
// get all relationships whether he is the sender or recipient
exports.getUserRelationShips = async (req, res) => {
  Relationship.find({ $or: [
    { sender: req.user._id },
    { recipient: req.user._id }
  ]})
  .then(relationships => {
    if (!relationships) {
      logger.warn('Didn\'t find any relationship');
      return res.status(204).send();
    }
    logger.info(`Current user has ${relationships.length}  relationships`);
  
    let findUser = async (id) => {
      try {
        return await User.findById(id);
      } catch(err) {
        logger.error(err);
      }
    };

    const promise = relationships.map(relationship => {
      const id = req.user._id.toString() === relationship.sender.toString() ? relationship.recipient : relationship.sender;
      return findUser(id).then(contact => {
        return {relationship, contact};
      });
    });

    Promise.all(promise).then(rooms => {
      console.log(rooms);
      return res.status(200).json({ status: 'OK', rooms: rooms });
    });
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something went wrong'});
  });
};
