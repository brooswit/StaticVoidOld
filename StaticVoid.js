const express = require('express');
const enableWs = require('express-ws');
const path = require('path');

const Controller = require('./Controller');
const ElementManager = require('./classes/ElementManager');

// UTILITY
async function asynchronously(method) {
    return method.then ? await method() : method();
}

function JSONparseSafe(str, fallback = undefined) {
    try {
        return JSON.parse(str);
    } catch (ex) {
        return fallback;
    }
}

class StaticVoid extends Element {
    constructor(options = {}) {
        new SessionManager(this);
        new AccountSessionManager(this);
        new AccountManager(this);
        
        this._port = process.env.PORT || options.port || 8080;
        this._syncThrottle = options.syncThrottle || 1000/3;

        this._app = express();

        enableWs(_app);

        _app.use(express.static(path.join(__dirname, 'public')))
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
        let client = new Client(this);

        ws.on('message', (msg) => {
            let {rpc} = JSONparseSafe(msg, {});
            if (rpc) {
                if (!rpc.command) {
                    let options = rpc.options || {};
                    client.emit(`rpc_${command}`, options);
                    client.emit(`rpc`, {command, options});
                }
            } else {
                return console.log('unknown websocket message type');
            }
        });

        ws.on('close', () => {
            client.destroy();
        });

        client.hook('destroy', () => {
            ws.close();
            client = null;
        });

        asynchronously(async () => {
            let getSnapshotStartTime;
            let getSnapshotEndTime;
            let sendSnapshotStartTime;
            let sendSnapshotEndTime;

            while(client) {
                let debug = {
                    getSnapshotStartTime,
                    getSnapshotEndTime,
                    sendSnapshotStartTime,
                    sendSnapshotEndTime
                };

                getSnapshotStartTime = Date.now();
                let snapshot = await client.getSnapshot({
                    state: {},
                    rpc: [],
                    debug
                });

                let rawData = JSON.stringify(snapshot);
                getSnapshotEndTime = Date.now();

                sendSnapshotStartTime = Date.now();
                await new Promise((done) => ws.send(rawData, done));
                sendSnapshotEndTime = Date.now();

                let snapshotDeltaTime = sendSnapshotEndTime - getSnapshotStartTime;

                let throttle = this._syncThrottle;
                let delay = Math.min(Math.max(1, throttle - snapshotDeltaTime), throttle);
                await new Promise((done) => setTimeout(done, delay));
            }
        });
    }
}
