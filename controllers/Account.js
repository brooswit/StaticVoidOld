const Controller = require('../classes/Controller');

module.exports = class Account extends Controller {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('session_login', (o)=>{

        });
    }

    login({username, passwordHash}) {
        this.parent.trigger(`session_${payload.command}`, payload.options);
    }
}