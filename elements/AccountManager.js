const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.hook('account_login', payload);
    }

    _onAccountLogin({session, username, passhash}) {
        let account = null;
        if (this.auth.login(username, passhash)) {
            account = new Account(this, {session, username, passhash});
        }
        return account;
    }
}
