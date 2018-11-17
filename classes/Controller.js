const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this._element = element;
        this,_element.on('destroy', this.remove);
        this,_element.on('snapshot', this.snapshot);
        this._removed = false;

        this._state = state;
    }

    getElement() {
        if(this._removed) return null;
        return this._element;
    }

    remove() {
        if(!this.getElement()) return;
        this._element.off('destroy', this.remove);
        this._element.off('snapshot', this.snapshot);
        this._removed = true;
    }

    snapshot(snapshot) {}

    addController() {
        if(!this.getElement()) return;
        return this._element.addController.apply(this._element, arguments);
    }
    removeController() {
        if(!this.getElement()) return;
        return this._element.removeController.apply(this._element, arguments);
    }
    destroy() {
        if(!this.getElement()) return;
        return this._element.destroy.apply(this._element, arguments);
    }
    on() {
        if(!this.getElement()) return;
        return this._element.on.apply(this._element, arguments);
    }
    off() {
        if(!this.getElement()) return;
        return this._element.off.apply(this._element, arguments);
    }
    trigger() {
        if(!this.getElement()) return;
        return this._element.trigger.apply(this._element, arguments);
    }
}
