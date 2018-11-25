const Element = require('./Element');

module.exports = class Session extends Element {
    constructor(parent, options) {
        super(parent, options);
        this.root().trigger('sess')
    }
}