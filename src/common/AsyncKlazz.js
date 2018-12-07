const Klazz = require('./Klazz')
const Resolver = require('./Resolver')

module.exports = class AsyncKlazz extends Klazz {
  constructor () {
    super()
    this._arguments = arguments
    this._readyPromise = new Resolver()
    this.asyncConstructor()
  }

  async asyncConstructor (isReady = true) {
    if (isReady) this._readyPromise.resolve()
  }

  ready () {
    this._readyPromise.resolve()
  }

  whenReady () {
    return this._readyPromise
  }
}
