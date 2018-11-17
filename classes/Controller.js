const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this._element = element;
        this,_element.on('destroy', this.destroy);
        this,_element.on('snapshot', this.decorateSnapshot);

        this._state = state;
    }

    get

    destroy() {}

    decorateSnapshot(snapshot) {}
}
