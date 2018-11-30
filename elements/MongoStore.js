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
  }
  async save (collection, key, value) {
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }

  async load (collection, key, optionalDefault) {
    let value = optionalDefault || null
    if (this.data[collection]) {
    }
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }

  async has (collection, key) {
    if (!this.data[collection]) return false
    if (!this.data[collection][key]) return false
    return true
  }
}
