module.exports = class Controller {
    constructor(parent, state = {}) {
        this.parent = parent;
        this,parent.on('destroy', this.destroy);

        this._state = state;
    }

    destroy() {}

    async getSnapshot(snapshot = {}) {
        return snapshot
    }
}
