const Element = require('./Element')
const getArgumentNames(func) {
    c.toString().split('(')[1].split(')')[0].replace(/\s/g,'').split(',')
}
function extract (args) {

}
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
    extract(arguments)
  }

  _onLoad ({ collection, key, defaultValue = null }) {
    this.load(collection, key, defaultValue)
  }
}
