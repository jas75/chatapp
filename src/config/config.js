module.exports = {
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    mongoUri: 'mongodb://' + this.dbUser + ':' + this.dbPass + '@ds341247.mlab.com:41247/chatappjas'
}