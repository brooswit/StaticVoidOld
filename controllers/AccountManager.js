
class AccountManager extends Element {
    constructor(parent, options) {
        super(parent);
        this.parent.hook('client_created', _onClientCreated);
    }

    _onClientCreated(newClient) {
        new Account(newClient)
    }
}

module.exports = ExpressManager