const Controller = require('../classes/Controller');

module.exports = class Session extends Controller {
    constructor(element, state) {
        super(element, state);
        this.element.on('session_message', this.injestMessage);
    }

    injestMessage(payload) {
        this.element.trigger(`session_${payload.command}`, payload.options);
    }
}