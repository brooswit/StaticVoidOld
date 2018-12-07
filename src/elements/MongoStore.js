const MongoClient = require('mongodb').MongoClient
const BaseStore = require('../common/BaseStore')

function NO_OP () {}
class Resolver extends Promise {
  constructor (resolver = NO_OP) {
    super((resolve, reject) => {
      this._resolver = resolve
      this._rejecter = reject

      resolver(this.resolve, this.reject)
    })
  }

  resolve (value) {
    this._resolver(value)
  }

  reject (err) {
    this._rejecter(err)
  }
}

module.exports = class MongoStore extends BaseStore {
  constructor (parent, options) {
    super(parent, options)

    this._host = this._options.host
    this._port = this._options.port
    this._username = this._options.username
    this._databaseName = this._options.databaseName

    this._authentication = (this._username & this._password) ? `${this._username}:${this._password}@` : ''
    this._url = 'mongodb://' + this._authentication + this._host + ':' + this._port + '/' + this._databaseName

    this._database = null
    this._readyPromise = new Resolver()

    this._connect()
  }

  onClientReady () {
    return this._readyPromise
  }

  _connect () {
    MongoClient.connect(this._url, this._mongoClientConnectHandler)
  }

  _mongoClientConnectHandler (err, database) {
    if (err) {
      console.log(`${err}`)
      this._connect()
    } else {
      this._database = database
      this._readyPromise.resolve()
    }
  }

  async save (collection, key, value) {
    await this.onClientReady()
    await new Promise(async (resolve, reject) => {
      this._database.collection(collection).updateOne({ key }, { $set: value }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res.result)
        }
      })
    })
  }

  async load (collection, key, optionalDefault) {
    await this.onClientReady()
    let value = await new Promise(async (resolve, reject) => {
      this._database.collection(collection).find({ key }).limit(1).toArray((err, results) => {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
    if (value === null && optionalDefault !== undefined) {
      value = optionalDefault
    }
    return value
  }

  async has (collection, key) {
    return await this.load(collection, key) !== null
  }
}
