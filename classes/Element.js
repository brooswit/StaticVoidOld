const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(parent) {
        this.state = {};

        this._isDestroyed = false;
        this._parentInterface = null;

        if (parent) this.attach(parent);
    }

    attach(parent) {
        if (this._isDestroyed) return;
        if (this.parent === parent) return;

        this.detach();

        this.parent = parent;
        this._parentInterface = new EventInterface(parent);
        this._parentInterface.on('snapshot', this.snapshot);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parentInterface) return;

        this.parent = parent;
        this._parentInterface.close();
        this._parentInterface = null;

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
