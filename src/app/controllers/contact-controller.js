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
