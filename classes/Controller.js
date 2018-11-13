const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this.parent = parent;
        this,parent.on('destroy', this.destroy);
        this,parent.on('snapshot', this.decorateSnapshot);

        this._state = state;
    }

    destroy() {}

    decorateSnapshot(snapshot) {}
}
