const Element = require('Element')

module.exports = class Manager extends Element {
  constructor (parent, options) {
    super(parent, options)

    this._Class = this._options.Class
    this._Class = this._options.Class
    this.parent.hook('account_login', this._onAccountLogin)
  }

  _onAccountLogin ({ session, username, password }) {
    let account = this.trigger(`get_account_${username}`)[0]
    if (!account) {
      account = new this._Class(this, username)
    }
    return account
  }
}
