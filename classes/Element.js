const EventManager = require('./EventManager');
let nextId = 0;
module.exports = class Element extends EventManager {
    constructor(parent) {
        super();
        this.id = nextId++;
        this.state = {};
        this._parent = null;
        this.parentInterface = new EventManagerInterface(parent);

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

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parent) return;

        this._parent = null;
        this.parentInterface.detach();

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
