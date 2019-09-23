var User = require('./../models/user');
var jwt = require('jsonwebtoken');
var config = require('./../../config/config');


// //TODO create a helper folder
function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email}, config.jwtSecret, {
        expiresIn: 86400
    });
}

exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send mail and password'});
    }
    
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg':  err});
        }
        
        if (user) {
            return res.status(400).json({ 'msg': 'the user already exists'});
        }
        
        
        // TODO always use var and now this ? use a linter bitch
        let newUser = User(req.body);
        
        newUser.save((err, user) => {
            if (err) {
                console.log(err)
                if (err.name === "ValidationError") {
                    return res.status(400).json({'msg':  "Wrong email format"});
                }
                return res.status(400).json({ 'msg': err});
            }

            return res.status(201).json(user);
        });
    });
};

exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'msg': 'Emial, alias or password not provided'});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err});
        }

        if (!user) {
            return res.status(400).json({ 'msg': 'the user does not  exists'});
        }


        // method of model User
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                // log successful
                return res.status(200).json({
                    token: createToken(user),
                    userid  : user._id
                })
                
            } else {
                return res.status(400).json({
                    msg: 'the email and password don\'t match'
                });
            }
        });
    });
};