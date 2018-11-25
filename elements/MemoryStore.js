const Element = require('./Element');

module.exports = class MemoryStore extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('save', ({path, value})=>{
            let pathElements = path.split('/');
            let pointer = this.data;
            for (let pathElementIndex = 0; pathElementIndex <= pathElements.length - 1; pathElementIndex ++) {
                pointer = pointer[]
                pathElement = pathElements[pathElementIndex];
            }
            this.data
            this.login(username, passwordHash)
        });
    }

    login(username, passwordHash) {
        
    }
}