const EventEmitter = require('events');

module.exports = class Element extends EventEmitter {
    constructor(id, behaviors, state) {
        this._id = id
        this._state = state
        this._behaviors = {}

        for(let behaviorIndex in behaviors) {
            let behaviorName = behaviors[behaviorIndex]
            this.addBehavior(behaviorName)
        }
    }

    addBehavior(behaviorName) {
        this._behaviors[behaviorName] = this._behaviors[behaviorName] || new Behaviors[behaviorName](this, state)
    }

    removeBehavior(behaviorName) {
        this._behaviors[behaviorName].destroy()
        this._behaviors[behaviorName] = null
    }

    destroy() {
        for(let behaviorIndex in behaviors) {
            let behaviorName = behaviors[behaviorIndex]
            this.removeBehavior(behaviorName)
        }
    }

    handleEvent(eventData) {
        for(let behavior in this._state.behaviors) {
            this._behaviors[behavior].handleEvent(eventData)
        }
    }

    async getSnapshot(snapshot = {}) {
        for(let behavior in this._state.behaviors) {
        snapshot = await this._behaviors[behavior].getSnapshot(snapshot)
        }
        return snapshot
    }
}
