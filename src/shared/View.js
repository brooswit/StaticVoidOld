const EventEmitter = require('events')

module.exports = class View {
  constructor (Class, newSource) {
    this._internalEvents = new EventEmitter()
    this._wrappedMethods = {}
    this._open = true
    this.source = null
    this.change(newSource)

    let methodNames = Object.getOwnPropertyNames(Class.prototype)
    for (let methodNameIndex in methodNames) {
      let methodName = methodNames[methodNameIndex]
      if (methodName[0] === '_') continue
      this[methodName] = this[methodName] || this.wrap(methodName)
    }
  }

  wrap (methodName) {
    if (this._wrappedMethods[methodName]) return this._wrappedMethods[methodName]
    this._wrappedMethods[methodName] = function () {
      if (!this.exists()) return null
      this.source[methodName].apply(this.source, arguments)
    }.bind(this)
    this._wrappedMethods[methodName].name = methodName
    return this._wrappedMethods[methodName]
  }

  isOpen () {
    return this._open
  }

  exists () {
    return this.isOpen() && !!this.source
  }

  change (newSource = null) {
    if (!this.isOpen() || this.source === newSource) return
    let oldSource = this.source
    this.source = newSource
    this._internalEvents.emit('source_changed', { oldSource, newSource })
  }

  close () {
    if (!this.isOpen()) return
    this.change(null)
    this._open = false
    this._internalEvents.emit('closed')
  }
}
