const BaseStore = require('./BaseStore')

module.exports = class MemoryStore extends BaseStore {
  async save (collection, key, value) {
    this.data[collection] = this.data[collection] || {}
    this.data[collection][key] = value
  }

  async load (collection, key, optionalDefault) {
    let value = optionalDefault !== undefined ? optionalDefault : null
    if (this.has(collection, key)) {
      value = this.data[collection][key]
    }
    return value
  }

  async has (collection, key) {
    if (!this.data[collection]) return false
    if (!this.data[collection][key]) return false
    return true
  }
}
