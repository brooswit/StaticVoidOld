const Controller = require('../classes/Controller');

module.exports = class Account extends Controller {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('session_login', ({username, passwordHash})=>{
            this.login(username, passwordHash)
        });
    }

    login(username, passwordHash) {
        
    }
}