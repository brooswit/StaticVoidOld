const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.hook('session_login', this._onSessionCreated);
    }

    _onSessionCreated(newSession) {
        new Account(this);
    }
}