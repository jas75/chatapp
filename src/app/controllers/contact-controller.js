const User = require('./../models//user');
const Relationship = require('./../models/relationship');
const logger = require('./../../../utils/logger');

exports.addContact = (req, res) => {
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
        .then(relation => {
          logger.info(relation.user_id_1 + ' and ' + relation.user_id_2 + ' are now linked');
          return res.status(201).json({ status: 'OK', msg: 'Relationship added' });
        })
        .catch(err => {
          logger.error(err);
          return res.status(400).json({ status: 'Bad Request', msg: 'Couldn\'t save a relationship because of' + err });
        });
    })
    .catch(err => {
      logger.error(err);
      return res.status(400).json({ status: 'Bad Request', msg: 'Couldn\'t return a relation because of' + err });
    });
};

exports.removeContact = (req, res) => {
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
        logger.info(`${req.body.user_id_1} and ${req.body.user_id_2} are not binded anymore`);
        return res.status(200).json({ status: "Ok", msg: 'Connection successfullly removed'});
      }
      logger.warn(`Bound between ${req.body.user_id_1} and ${req.body.user_id_2} does not exist`);
      return res.status(400).json({ status: 'Bad Request', msg: 'Bound does not exist'});
    })
    .catch(err => {
      logger.error(err);
      return res.status(400).json({ status: 'Bad Request', msg: 'Something wrong happpened'});
    });
};

exports.getOneOrManyContacts = (req, res) => {
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
      return res.status(204).send();
    }
    
    return res.status(200).json({ status: 'OK', users: users });
  })
  .catch(err => {
    console.log(err);
    logger.error(err);
    return res.status(400).json({ status: 'Bad Request', msg: 'Something wrong happened' });
  });
};