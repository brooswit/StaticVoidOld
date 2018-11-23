const Element = require('../classes/Element_old');

module.exports = class Account extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('session_login', ({username, passwordHash})=>{
            this.login(username, passwordHash)
        });
    }

    login(username, passwordHash) {
        
    }
}