const Element = require('./Element')
const applyOpts = require('../common/applyOpts')

module.exports = class BaseStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.rootView().hook('save', this._onSave)
    this.rootView().listen('load', this._onLoad)
    this.rootView().listen('has', this._onHas)
  }

  _onSave (opts) {
    applyOpts(this.save, opts, this)
  }

  _onLoad (opts) {
    applyOpts(this.load, opts, this)
  }

  _has (opts) {
    applyOpts(this.has, opts, this)
  }

  async save (collection, key, value) {}
  async load (collection, key, defaultValue = null) {}
  async has (collection, key) {}
}
