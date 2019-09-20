var User = require('./../models/user');
var jwt = require('jsonwebtoken');
var config = require('./../../config/config');


// //TODO create a helper folder
// function createToken(user) {
//     return jwt.sign({ id: user.id, email: user.email}, config.jwtSecret, {
//         expiresIn: 86400
//     });
// }

exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send mail and password'});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err});
        }

        if (user) {
            return res.status(400).json({ 'msg': 'the user already exists'});
        }


        // TODO always use var and now this ?
        let newUser = User(req.body);

        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err});
            }

            return res.status(201).json(user);
        });
    });
};
