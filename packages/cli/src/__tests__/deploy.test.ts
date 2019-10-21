import { action } from '../commands/deploy';

describe('deploy', function () {
  test('a file', async function () {
    try {
      await action('testing', ['src/__tests__/funcs/basic.func.ts']);
    } catch (error) {
      expect(error.message).toEqual('Cannot find module \'@faasjs/request\' from \'index.js\'');
    }
  }, 30000);

  test('a folder', async function () {
    try {
      await action('testing', ['src/__tests__/funcs/']);
    } catch (error) {
      expect(error.message).toEqual('Provider is not a constructor');
    }
  }, 30000);
});
