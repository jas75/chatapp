var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    alias: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
})


// pre save schema done before saving to database

UserSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    })
})

// if the user logs later on  need a safe way to compare passwords

//TODO check about arrows functions
UserSchema.methods.comparePassword = function(candidatePassword, cb) { // and not here 
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => { // why use arrow function
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema);