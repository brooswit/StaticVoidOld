const Element = require('./Element')

module.exports = class MemoryStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.parent.hook('save', ({ path, value }) => {
      let pathElements = path.split('/')
      let pointer = this.data
      for (let pathElementIndex = 0; pathElementIndex < pathElements.length - 1; pathElementIndex++) {
        pointer = pointer[pathElementIndex] === undefined ? {} : pointer[pathElementIndex]
        pathElement = pathElements[pathElementIndex]
      }
      pointer[pathElements.length - 1] = value
    })
    this.parent.hook('load', ({ path, value }) => {
      let pathElements = path.split('/')
      let pointer = this.data
      for (let pathElementIndex = 0; pathElementIndex < pathElements.length - 1; pathElementIndex++) {
        pointer = pointer[pathElementIndex] === undefined ? {} : pointer[pathElementIndex]
        pathElement = pathElements[pathElementIndex]
      }
      return pointer[pathElements.length - 1]
    })
  }
}
