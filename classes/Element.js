const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(world) {
        this._isDestroyed = false;
        this.state = {};
        this.worldEvents = null;
        if (world) this.attach(world);
    }

    attach(world) {
        if (this._isDestroyed) return;
        if (this.worldEvents === world) return;

        this.detach();

        this.worldEvents = new EventInterface(world);
        this.worldEvents.on('snapshot', this.snapshot);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this.worldEvents) return;

        this.worldEvents.close();
        this.worldEvents = null;

        this.trigger('dettached');
    }

    destroy() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;
        this.worldEvents.close();
        this.trigger('destroyed');
        this.close();
    }

    snapshot(snapshot) {
        this.trigger('snapshot', snapshot);
    }
}
