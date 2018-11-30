const BaseStore = require('./BaseStore')

module.exports = class MongoStore extends BaseStore {
  constructor()
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
