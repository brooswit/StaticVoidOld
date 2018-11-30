const Element = require('./Element')


module.exports = class BaseStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.rootView().hook('save', this._onSave)
    this.rootView().hook('load', this._onLoad)
  }

  _onSave ({ collection, key, value }) {
    this.save(collection, key, value)
  }

  save (collection, key, value) {
    let args = extractArguments(arguments)
  }

  _onLoad ({ collection, key, defaultValue = null }) {
    this.load(collection, key, defaultValue)
  }
}
