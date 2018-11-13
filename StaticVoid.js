const express = require('express');
const enableWs = require('express-ws');
const path = require('path');

const ElementManager = require('./classes/ElementManager');

class StaticVoid extends ElementManager {
    constructor(options = {}) {
        this._port = process.env.PORT || options.port || 8080;
        this._syncThrottle = options.syncThrottle || 1000/3;

        const app = express();

        enableWs(app);

        app.use(express.static(path.join(__dirname, 'public')))
          .set('views', path.join(__dirname, 'views'))
          .set('view engine', 'ejs')
          .get('/', this._handleRequest)
          .ws('/stream', this._handleStream)
          .listen(this._port);
    }

    _handleRequest(req, res) {
        res.render('pages/main', {});
    }

    _handleStream(ws) {
        let sessionElement = this.buildElement(['Session']);

        ws.on('message', (msg) => {
            sessionElement.emit('sessionMessage', JSON.parse(msg));
        });

        ws.on('close', () => {
            sessionElement.destroy();
            sessionElement = null;
        });

        (async ()=>{
            let getSnapshotStartTime;
            let getSnapshotEndTime;
            let sendSnapshotStartTime;
            let sendSnapshotEndTime;

            while(sessionElement) {
                let debug = {
                    getSnapshotStartTime,
                    getSnapshotEndTime,
                    sendSnapshotStartTime,
                    sendSnapshotEndTime
                };

                getSnapshotStartTime = Date.now();
                let snapshot = await sessionElement.getSnapshot({});
                snapshot.debug = debug;
                let rawData = JSON.stringify(snapshot);
                getSnapshotEndTime = Date.now();

                sendSnapshotStartTime = Date.now();
                await new Promise((done) => ws.send(rawData, done));
                sendSnapshotEndTime = Date.now();

                let snapshotDeltaTime = sendSnapshotEndTime - getSnapshotStartTime;

                let throttle = this._syncThrottle
                let delay = Math.min(Math.max(1, throttle - snapshotDeltaTime), throttle)
                await new Promise((done) => setTimeout(done, delay))
            }
        })()
    }

    registerBehavior(Behavior) {
        this._Behaviors[Behavior.name] = Behavior;
    }

    createElement(behaviors = [], state = {}) {
        let id = nextElementId++
        elements[id] = new Element(id, behaviors, state)
    }
}

StaticVoid.Behavior = Behavior;

module.exports = StaticVoid;