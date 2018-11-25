const Element = require('./Element');
const ClientSession = require('./ClientSession');

module.exports = class SessionManager extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.root.hook('client_created', this._onClientCreated);
    }

    _onClientCreated(newClient) {
        new ClientSession(newClient);
    }
}
