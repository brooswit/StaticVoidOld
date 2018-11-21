const Element = require('../classes/Element');

module.exports = class Session extends Element {
    constructor(element, state) {
        super(element && element.root, state);
        this.element.on('rpc', this.injestMessage);
    }

    injestMessage(payload) {
        this.element.trigger(`rpc_${payload.rpc.command}`, payload.options);
    }
}