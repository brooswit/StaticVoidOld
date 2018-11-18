const EventManager = require('./EventManager');

module.exports = class Controller extends EventManager.Interface {
    constructor(elementManager, element, state = {}) {
        super(element);
        this._isRemoved = false;

        this.elementManager = elementManager;
        this._element = element;
        this.elementManagerEventInterface = new EventManager.Interface(this.elementManager);
        
        this.on('destroy', this.remove);
        this.on('snapshot', this.snapshot);

        this._state = state;
    }

    getElement() {
        return this._isRemoved ? null : this._element;
    }

    remove() {
        if(!this.getElement()) return;
        this._isRemoved = true;
        this.close();
        this.elementManagerEventInterface.close();
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
        return this._elementEventInterface.on.apply(this._elementEventInterface, arguments);
    }
    off() {
        if(!this.getElement()) return;
        return this._elementEventInterface.off.apply(this._elementEventInterface, arguments);
    }
    trigger() {
        if(!this.getElement()) return;
        return this._elementEventInterface.trigger.apply(this._elementEventInterface, arguments);
    }
}
