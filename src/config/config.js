module.exports = {
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  mongoUri: 'mongodb://' + this.dbUser + ':' + this.dbPass + '@ds341247.mlab.com:41247/chatappjas',
  jwtSecret: process.env.JWT_SECRET
};
