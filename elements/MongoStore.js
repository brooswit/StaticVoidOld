const MongoClient = require('mongodb').MongoClient
const BaseStore = require('./BaseStore')

module.exports = class MongoStore extends BaseStore {
  constructor (parent, options) {
    super(parent, options)
    this._connect()
  }

  _connect() {
    const {host, port, username, password, database} = options
    authenticate = username & password ? `${username}:${password}@` : ''
    var url = 'mongodb://'+authenticate+host+':'+port + '/' + mongodbDatabase;
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log(err);
        this._connect()
        return
      }
    })
  }

  async save (collection, key, value) {}

  async load (collection, key, optionalDefault) {}

  async has (collection, key) {}
}
