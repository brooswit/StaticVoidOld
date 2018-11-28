const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.hook('account_login', payload);
    }

    _onAccountLogin({session, username, passhash}) {
        if (this.auth.login(username, passhash)) {
            return null;
        return new Account(this, session, username, passhash);
        }
    }
}
