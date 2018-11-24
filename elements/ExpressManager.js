
class ExpressManager extends Element {
    constructor(parent, options) {
        super(parent)
        this._port = process.env.PORT || options.port || 8080;
        this._syncThrottle = options.syncThrottle || 1000/3;

        this._app = express();

        enableWs(_app);

        _app.use(express.static(path.join(__dirname, 'public')))
            .set('views', path.join(__dirname, 'views'))
            .set('view engine', 'ejs')
            .get('/', this._handleWebRequest)
            .ws('/stream', this._handleStreamRequest)
            .listen(this._port);
    }

    _handleWebRequest(req, res) {
        new
        this.trigger('webRequest', {req, res});
    }

    _handleStreamRequest(ws) {
        this.trigger('streamRequest', ws);
    }
}

module.exports = ExpressManager