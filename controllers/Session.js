const Controller = require('../classes/Controller');

module.exports = class Session extends Controller {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('sessionMessage', this.injestMessage);
    }

    in
}