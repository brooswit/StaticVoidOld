const View = require('./View')
const Element = require('./Element')
const ElementQueryHook = require('./ElementQueryHook')
const ElementEventHook = require('./ElementEventHook')

module.exports = class ElementView extends View {
  constructor (sourceElement) {
    super(Element, sourceElement)
    this.hook('destroyed', this.close)
  }

  view () {
    if (this._isDestroyed) return null
    return new ElementView(this)
  }

  hook (eventName, callback) {
    return new ElementQueryHook(this, eventName, callback)
  }

  listen (eventName, callback) {
    return new ElementEventHook(this, eventName, callback)
  }
}
