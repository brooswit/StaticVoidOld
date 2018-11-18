const Controller = require('../classes/Controller');

module.exports = class Session extends Controller {
    constructor(element, state) {
        super(element, state);
        this.element.on('rpc', this.injestMessage);
    }

    injestMessage(payload) {
        this.element.trigger(`rpc_${payload.rpc}`, payload.options);
    }
}