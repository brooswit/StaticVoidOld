const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor() {
        this.state = {};
        this.world = null;
    }

    attach(world) {
        if (this._isDestroyed) return;
        if (this.world) return;
        this.world = new EventInterface(world);
        this.world.on('snapshot', this.snapshot);
        this.trigger('attached');
    }

    detach() {
        
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
