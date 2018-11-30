const BaseStore = require('./BaseStore')

module.exports = class MemoryStore extends BaseStore {
  save (collection, key, value) {
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }
  load (collection, key, optionalDefault) {
    let value = optionalDefault || null
    if (this.data[collection]) {
    }
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }
  has (collection, key) {
    if (this.data[collection]) {
      return false
    }
    if (this.data[collection]) {}
  }
}
