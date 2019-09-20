var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./src/config/config');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');

var app = express();

app.disable('etag');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
passport.use(passport.initialize());

var passportMiddleware = require('./src/middlewares/passport');
passport.use(passportMiddleware);

app.get('/', function(req, res) {
    return res.send('Hello! The API is at http://localhost:3000/api');
});

//app.use(express.static(path.join(__dirname, 'src/public')));


var userRoutes = require('./src/routes/users.js');

app.use('/api', userRoutes);
// var indexRoutes = require('./src/routes/index.js');
// var postRoutes = require('./src/routes/post.js');
// var userRoutes = require('./src/routes/users.js');
// var communityRoutes = require('./src/routes/community.js');
// app.use('/api', indexRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/community', communityRoutes);

var mongoUri = 'mongodb://' + config.dbUser + ':' + config.dbPass + '@ds341247.mlab.com:41247/chatappjas'
mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});

connection.on('error', (err) => {
    console.log("MongoDb connection error. Please make sure MongoDB is running." + err);
    process.exit();
});

module.exports = app;