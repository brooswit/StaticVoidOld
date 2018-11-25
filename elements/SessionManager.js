const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('client_created', this._onSessionCreated);
    }

    _onSessionCreated(newSession) {
        new Account(newSession);
    }
}