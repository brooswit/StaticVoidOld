const Element = require('./Element');

module.exports = class MemoryStore extends Element {
    constructor(parent, state) {
        super(parent, state);
        this.parent.on('save', ({path, value})=>{
            let pathElements = path.split('/');
            for (pathElementIndex in pathElements) {
                pathElement = pathElements[pathElementInd]
            }
            this.data
            this.login(username, passwordHash)
        });
    }

    login(username, passwordHash) {
        
    }
}