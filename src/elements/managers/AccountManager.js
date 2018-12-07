const Element = require('../../shared/Element')
const Account = require('../Account')

module.exports = class AccountManager extends Element {
  constructor (parent) {
    super(parent)
    this.rootView().listen('accounts:login', this._onLogin)
  }

  async _onLogin ({ username, password }) {
    let account = this.request(`account:find:${username}`)[0]
    if (!account) {
      account = new Account(this, username)
    }
    return account.authenticate({ username, password })
  }
}
