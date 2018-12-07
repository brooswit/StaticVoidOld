const getArgNames = require('../../src/common/getArgNames')

test('outputs array argument names for a function', () => {
  function func (a, b, c) {}
  let funcArgs = getArgNames(func)
  let expectedArgs = ['a', 'b', 'c']
  expect(funcArgs).toEqual(expectedArgs)
})
