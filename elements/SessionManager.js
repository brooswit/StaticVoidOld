const Element = require('./Element');

module.exports = class SessionManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('client_created', this._onClientCreated);
    }

    _onClientCreated(newClient) {
        new Session(newClient);
    }
}