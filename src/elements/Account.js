const Element = require('../shared/Element')

module.exports = class Account extends Element {
  constructor (parent, username) {
    super(parent)
    this._username = username
    this._password = null

    this.parentView().hook(`account:find:${this._username}`)
  }

  async asyncConstructor () {
    super.asyncConstructor(false)
    const rootView = await this.rootView()
    const accountData = await rootView.request('load', {
      collection: 'accounts',
      key: this._username }
    )[0]

    this._username = accountData.username
    this._password = accountData.password

    this.ready()
  }

  async authenticate (password) {
    await this.whenReady()
    return this._password === password
  }
}
