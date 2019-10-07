const User = require('./../models/user');
const Relationship = require('./../models/relationship');
const logger = require('./../../../utils/logger');

exports.sendFriendRequest = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Forbidden' });
  }

  if (!req.body.user_id_1 || !req.body.user_id_2) { 
    logger.warn('Missing payload parameters');
    return res.status(400).json({ msg: 'Something wrong happened' });
  }

  if(req.body.user_id_1 === req.body.user_id_2) {
    logger.warn('User trying to add himself');
    return res.status(400).json({ status: 'Bad Request', msg: 'You can\'t add yourself' });
  }

  Relationship.find({ user_id_1: req.body.user_id_1, user_id_2: req.body.user_id_2 })
    .then(relation => {
      if (relation.length > 0) {
        logger.warn('Relation already exists');
        return res.status(409).json({ status: 'Conflict', msg: 'Relation already exists' });
      }

      const relationship = new Relationship(req.body);

      relationship.save()
        .then(friendrequest => {
          logger.info(friendrequest.user_id_1 + ' sent a friend request to ' + friendrequest.user_id_2);
          return res.status(201).json({ status: 'OK', msg: 'Relationship added' });
        })
        .catch(err => {
          logger.error(err);
          return res.status(400).json({ status: 'Bad Request', msg: 'Couldn\'t send friend reques because of' + err });
        });
    })
    .catch(err => {
      logger.error(err);
      return res.status(400).json({ status: 'Bad Request', msg: 'Couldn\'t return a relation because of' + err });
    });
};

exports.removeContact = (req, res) => {
  // je veux aussi aller supprimer l'entrée dans le tableau des 2 user !
  if (!req.user) {
    return res.status(401).json({ msg: 'Forbidden' });
  }

  if (!req.body.user_id_1 || !req.body.user_id_2) {
    logger.warn('Missing payload parameters');
    return res.status(400).json({ msg: 'Something wrong happened' });
  }

  Relationship.deleteOne({ user_id_1: req.body.user_id_1, user_id_2: req.body.user_id_2 })
    .then(relation => {
      if (relation.deletedCount > 0) {
        logger.info(`${req.body.user_id_1} and ${req.body.user_id_2} are not friends anymore`);
        return res.status(200).json({ status: "Ok", msg: 'Connection successfullly removed'});
      }
      logger.warn(`${req.body.user_id_1} and ${req.body.user_id_2} are not friends`);
      return res.status(400).json({ status: 'Bad Request', msg: 'Bound does not exist'});
    })
    .catch(err => {
      logger.error(err);
      return res.status(400).json({ status: 'Bad Request', msg: 'Something wrong happpened'});
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
    { email: { $regex: '.*' + req.params.email + '.*' } },
    { username: { $regex: '.*' + req.params.email + '.*' } }
  ]})
  .then(users => {
    if (users.length <= 0) {
      logger.info('Didn\'t find any user for these refs');
      return res.status(204).send();
    }
    
    logger.info(`${users.length} user matching`);
    return res.status(200).json({ status: 'OK', users: users });
  })
  .catch(err => {
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something wrong happened' });
  });
};