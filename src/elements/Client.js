const Element = require('../shared/Element')
const Session = require('../common/Session')

module.exports = class Client extends Element {
  constructor (parent) {
    super(parent)
    this._session = new Session(this)
  }

  session () {
    return this._session
  }
}
