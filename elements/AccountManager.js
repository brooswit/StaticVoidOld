const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.hook('account_login', this._onAccountLogin);
    }

    _onAccountLogin(newSession) {
        this.auth.login()
        new Account(this);
    }
}