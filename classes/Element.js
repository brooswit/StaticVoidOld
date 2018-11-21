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

    parent

    root() {
        let element = this;
        let token = {};
        while (element._parent) {
            if (element.root.__token === token) return null;
            element.root.__token = token;
            element = element._parent;
        }
        return element;
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
