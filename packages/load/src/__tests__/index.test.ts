import * as load from '../index';

test('should work', function () {
  expect(load).toHaveProperty('loadConfig');
  expect(load).toHaveProperty('loadTs');
});
