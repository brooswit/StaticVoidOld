const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(parent) {
        this._isDestroyed = false;
        this.state = {};
        this._parentEvents = null;
        if (parent) this.attach(parent);
    }

    attach(parent) {
        if (this._isDestroyed) return;
        if (this._parentEvents === parent) return;

        this.detach();

        this._parentEvents = new EventInterface(parent);
        this._parentEvents.on('snapshot', this.snapshot);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parentEvents) return;

        this._parentEvents.close();
        this._parentEvents = null;

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
