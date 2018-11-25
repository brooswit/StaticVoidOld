const Element = require('./Element');

module.exports = class ClientSession extends Element {
    constructor(parent, options) {
        super(parent, options);
        this.root().trigger('session_created', this);
    }
}
