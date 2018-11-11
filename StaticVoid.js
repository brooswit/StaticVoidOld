const express = require('express')
const enableWs = require('express-ws');
const path = require('path')

const Element = require('./classes/Element')

const SessionBehavior = require('./behaviors/SessionBehavior')

module.exports = class StaticVoidHost {
    constructor(options = {}) {
        this._port = process.env.PORT || options.port || 8080
        this._syncThrottle = options.syncThrottle || 1000/3

        this._nextElementId = 0
        this._elements = []
        this._Behaviors = []

        const app = express()

        enableWs(app)

        app.use(express.static(path.join(__dirname, 'public')))
          .set('views', path.join(__dirname, 'views'))
          .set('view engine', 'ejs')
          .get('/', this._handleRequest)
          .ws('/stream', this._handleStream)
          .listen(this._port)

        this.registerBehavior(SessionBehavior)
    }

    _handleRequest(req, res) {
        res.render('pages/main', {})
    }

    _handleStream(ws) {
        let sessionElement = this.createElement(['SessionBehavior', ws]);

        ws.on('message', (msg) => {
            sessionElement.handleEvent(JSON.parse(msg));
        });
        
        ws.on('close', () => this.destroy() );

        sessionElement.
    }

    registerBehavior(Behavior) {
        this._Behaviors[Behavior.name] = Behavior;
    }

    createElement(behaviors, state) {
        let id = nextElementId++
        elements[id] = new Element(id, behaviors, state)
    }
}
