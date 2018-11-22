class EventQuery {
    constructor() {
        this._emitter = new EventEmitter();
    }

    on(event, promise) {
        this._emitter.on(event, (begin, resolve, reject) => {
            let index = begin();
            promise.then((result)=>{
                resolve(index, result);
            }).catch((error) => {
                reject(index, error);
            });
        })
    }

    query(eventName, payload) {
        let results = [];
        let errored = false;
        return new Promise((resolve, reject) => {
            this._emitter.emit(eventName,
                ()=>{
                    let index = results.length-1;
                    results.push(null);
                },
                (index, result)=>{
                    handleResponse(index, null, result);
                },
                (index, error) => {
                    handleResponse(index, error, null);
                }
            );

            function handleResponse(index, error, result) {
                errored = errored || !!error;
                results[index] = {error, result};
                for(resultIndex in results) {
                    if(!results[resultIndex]) return;
                }
                    
            }
        });
    }
}
class EventHandler extends promise {
    _capturePromiseResolution(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }

    constructor(abra, eventName, callback) {
        super(this._capturePromiseResolution);
        this._abra = abra;
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();

        this._abra._events.once('closed', this.off);
        this._abra._emitter.on(this._eventName, this.trigger);
        this._events.on('triggered', this._callback);
        this._events.once('triggered', this._resolve);
        this._events.once('errored',  this._reject);
    }

    trigger(payload) {
        this._events.emit('triggered', payload);
    }

    off() {
        this._abra._events.off('closed', this.off);
        this._abra._emitter.off(this._eventName, this.trigger);
        this._events.off('triggered', this._callback);
        this._events.off('triggered', this._resolve);
        this._events.off('errored', this._reject);
    }
}

class View extends Abra {
    constructor(abra) {
        super();
        this._abra = abra;
        this._abra._events.once('closed', this.close);
        this._emitter = this._abra._emitter;
    }
    close() {
        super.close();
        this._abra._events.off('closed', this.close);
    }
}

class Abra {
    constructor() {
        this._emitter = new EventEmitter();
        this._events = new EventEmitter();
    }
    on(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }
    trigger(eventName, payload) {
        this._emitter.emit(eventName, payload);
    }
    close() {
        this._events.emit('closed')
    }
}

Abra.View = View;

module.exports = Abra;
