const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this._element = element;
        this,_element.on('destroy', this.remove);
        this,_element.on('snapshot', this.snapshot);

        this._state = state;
    }

    getElement() {
        return this._element;
    }

    destroy() {
        this._element.off('destroy', this.destroy);
        this._element.off('snapshot', this.snapshot);
    }

    snapshot(snapshot) {}

    addController() {
        this._element.addController.apply(this._element, arguments);
    }
    removeController() {
        this._element.removeController.apply(this._element, arguments);
    }
    on() {
        this._element.on.apply(this._element, arguments);
    }
    off() {
        this._element.off.apply(this._element, arguments);
    }
    trigger() {
        this._element.trigger.apply(this._element, arguments);
    }
}
