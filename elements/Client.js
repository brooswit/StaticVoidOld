const Element = require('./Element');

module.exports = class Account extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('rpc_login', ({username, passwordHash})=>{
            this.login(username, passwordHash)
        });
    }

    login(username, passwordHash) {
        
    }
}