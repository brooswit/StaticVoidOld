
module.exports = class Klazz {
  constructor (privateContext) {
    this._isActive = true
  }
  deconstructor () {
    this._isActive = false
  }
  deconstruct () {
    this._isActive = false
    this.deconstructor()
  }
}
