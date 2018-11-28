const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.hook('account_login', payload);
    }

    _onAccountLogin({session, username, passhash}) {
        this.auth.login(username, passhash);
        new Account(this, session, username, passhash);
    }
}
