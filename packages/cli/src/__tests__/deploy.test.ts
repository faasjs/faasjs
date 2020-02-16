import { action } from '../commands/deploy';

describe('deploy', function () {
  test('a file', async function () {
    try {
      await action('testing', [__dirname + '/funcs/basic.func.ts']);
    } catch (error) {
      expect(error.message).toEqual('Missing secretId or secretKey!');
    }
  }, 30000);

  test('a folder', async function () {
    try {
      await action('testing', [__dirname + '/funcs/']);
    } catch (error) {
      expect(error.message).toEqual('Missing secretId or secretKey!');
    }
  }, 30000);
});
