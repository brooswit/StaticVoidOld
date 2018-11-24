
class AccountManager extends Element {
    constructor(parent, options) {
        super(parent);
        this.parent.hook('client_created', _onClientCreated)
    }
}

module.exports = ExpressManager