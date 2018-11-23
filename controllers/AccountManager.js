const Element = require('../classes/Element_old');

module.exports = class Session extends Element {
    constructor(parent, state) {
        super(parent && parent.root(), state);

        this.on('rpc', this._triggerRPC);
    }

    _triggerRPC(payload) {
        this.trigger(`rpc_${payload.rpc.command}`, payload.options);
    }
}