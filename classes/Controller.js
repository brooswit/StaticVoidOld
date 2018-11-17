const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this._element = element;
        this,_element.on('destroy', this.destroy);
        this,_element.on('snapshot', this.snapshot);

        this._state = state;
    }

    getElement() {
        return this._element;
    }

    addController()

    destroy() {
        this._element.off('destroy', this.destroy);
        this._element.off('snapshot', this.snapshot);
    }

    snapshot(snapshot) {}
}
