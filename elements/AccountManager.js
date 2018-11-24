const Element = require('./Element');

module.exports = class AccountManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('session_created', this._onSessionCreated);
    }

    login(username, passwordHash) {
        
    }
}