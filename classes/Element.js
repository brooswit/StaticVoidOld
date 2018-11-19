const Abra = require('./Abra');
let nextId = 0;
module.exports = class Element extends Abra {
    constructor(parent) {
        super();
        this.id = nextId++;
        this.parentInterface = new Abra.();
        this.rootInterface = new Abra.Interface();
        this.state = {};
        this._parent = null;
        this._isDestroyed = false;

        if (parent) this.attach(parent);
    }

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

    attach(parent) {
        if (this._isDestroyed) return;
        if (this._parent === parent) return;

        this.detach();

        this._parent = parent;
        this.parentInterface.attach(this._parent);
        this.rootInterface.attach(this.root());

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parent) return;

        this._parent = null;
        this.parentInterface.detach();
        this.rootInterface.detach();

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
