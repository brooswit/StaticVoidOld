const Element = require('../shared/Element')
const applyOpts = require('./applyOpts')

module.exports = class SessionAuthentication extends Element {
  constructor (session) {
    super(session.parent())
    this.parentView().listen('client:op:login', this._onLogin)

    this._account = null
  }

  _onLogin (opts) {
    return !!applyOpts(this.login, opts, this)
  }

  async login (username, password) {
    const rootView = await this.rootView()
    this._account = await rootView.request('accounts:login', { username, password })[0]
    return this._account
  }
}
