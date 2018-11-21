const Abra = require('./Abra');
let nextId = 0;
module.exports = class Element extends Abra {
    constructor(parent) {
        super();
        this.id = nextId++;
        this.parentView = new Abra.View(parent);
        this.state = {};
        this._parent = null;
        this._isDestroyed = false;ß

        if (parent) this.attach(parent);
    }

    parent() {
        return this._parent;
    }

    root() {
        let element = this;
        while (element.parent()) {
            element = element.parent();
        }
        return element;
    }

    _detectLoop() {
        let elementA, elementB = this;
        while (elementA) {
            elementA = elementA.parent();
            elementA = elementA.parent();
            
        }
    }
    attach(newParent) {
        if (this._isDestroyed) return;
        if (this._parent === newParent) return;

        this.detach();

        this._parent = newParent;
        this.parentView.attach(this._parent);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parent) return;

        this._parent = null;
        this.parentView.detach();

        this.trigger('dettached');
    }

    destroy() {
        if (this._isDestroyed) return;
        this.detach();
        this._isDestroyed = true;
        this.trigger('destroyed');
        this.close();
    }

    snapshot(snapshot) {
        if (this._isDestroyed) return;
        this.trigger('snapshot', snapshot);
    }
}
