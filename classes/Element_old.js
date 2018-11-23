const Abra = require('../elements/Element');
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

    _detectLoopWith(newParent) {
        let hasLoop = false;
        let oldParent = this._parent;
        let elementA, elementB = this;

        this._parent = newParent;
        
        while (elementB) {
            elementA = elementA.parent();
            elementB = elementB && elementB.parent() && elementB.parent().parent();
            if (elementA === elementB) {
                hasLoop = true;
                break;
            }
        }
        this._parent = oldParent;
        return hasLoop;
    }

    attach(newParent) {
        if (this._isDestroyed) return;
        if (this._parent === newParent) return;
        if (this._detectLoopWith(newParent)) return;
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
