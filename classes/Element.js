const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(parent) {
        super();
        this.state = {};
        this._parent = null;
        this._parentInterface = new EventManagerInterface(parent)
        this._isDestroyed = false;

        if (parent) this.attach(parent);
    }

    root() {
        let element = this;
        let token = {};
        while (element.parent) {
            if (element.root.__token === token) return null;
            element.root.__token = token;
            element = element.parent;
        }
        return element;
    }

    attach(parent) {
        if (this._isDestroyed) return;
        if (this._parent === parent) return;

        this.detach();

        this.parent = parent;
        this._parentInterface.attach(parent);
        this._parentInterface.hook('snapshot', this);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this.parent) return;

        this._parentInterface.close();
        this._parentInterface = null;
        this.parent = null;

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
