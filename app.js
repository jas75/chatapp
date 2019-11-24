require('dotenv').config();
const express = require('express');
//  const path = require('path')
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./src/config/config');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const app = express();

app.disable('etag');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passport.use(passport.initialize());

const passportMiddleware = require('./src/middlewares/passport');
passport.use(passportMiddleware);

app.get('/', (req, res) => {
  return res.send('Hello! The API is at http://localhost:3000/api');
});

// app.use(express.static(path.join(__dirname, 'src/public')));

const api = require('./src/routes/api.js');

app.use('/api', api);
// var indexRoutes = require('./src/routes/index.js');
// var postRoutes = require('./src/routes/post.js');
// var userRoutes = require('./src/routes/users.js');
// var communityRoutes = require('./src/routes/community.js');
// app.use('/api', indexRoutes);
// app.use('/api/post', postRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/community', communityRoutes);

// var mongoUri = 'mongodb://' + config.dbUser + ':' + config.dbPass + '@ds341247.mlab.com:41247/chatappjas'

mongoose.connect(config.dbHost + config.dbName, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

connection.on('error', (err) => {
  console.log('MongoDb connection error. Please make sure MongoDB is running.' + err);
  process.exit();
});
//console.log(app);

module.exports = app;
