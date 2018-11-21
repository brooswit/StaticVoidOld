const Element = require('../classes/Element');

module.exports = class Session extends Element {
    constructor(parent, state) {
        super(parent && parent.root(), state);
        this.parentView.on('rpc', this.injestMessage);
    }

    injestMessage(payload) {
        this.parent.trigger(`rpc_${payload.rpc.command}`, payload.options);
    }
}