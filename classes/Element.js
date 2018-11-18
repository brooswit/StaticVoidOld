const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor() {
        this.state = {};
        this.world = null;
    }

    attach(world) {
        if (this._isDestroyed) return;
        if (this.world === world) return;
        if (this.world)
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
        this.trigger('destroy');
    }

    snapshot(snapshot) {
        this.trigger('snapshot', snapshot);
    }
}
