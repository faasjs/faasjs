import * as load from '../index'

test('should work', () => {
  expect(load).toHaveProperty('loadConfig')
  expect(load).toHaveProperty('loadTs')
})
