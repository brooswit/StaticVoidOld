const Element = require('./Element')

module.exports = class MemoryStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.rootView().hook('save', this._onSave)
    this.rootView().hook('load', this._onLoad)
  }

  _onSave ({ collection, key, value }) {
    this.save(collection, key, value)
  }

  _onLoad ({ collection, key, defaultValue = null }) {
    this.load(collection, key, defaultValue)
  }
}
