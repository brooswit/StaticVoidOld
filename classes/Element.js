const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(world) {
        this._isDestroyed = false;
        this.state = {};
        if (world) this.attach(world);
    }

    attach(world) {
        if (this._isDestroyed) return;
        if (this.world === world) return;

        this.detach();

        this.world = new EventInterface(world);
        this.world.on('snapshot', this.snapshot);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this.world) return;

        this.world.close();
        this.world = null;

        this.trigger('dettached');
    }

    destroy() {
        if (this._isDestroyed) return;
        this._isDestroyed = true;
        this.world.close();
        this.trigger('destroyed');
        this.close();
    }

    snapshot(snapshot) {
        this.trigger('snapshot', snapshot);
    }
}
