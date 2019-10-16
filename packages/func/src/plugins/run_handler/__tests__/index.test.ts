import { Func, InvokeData } from '../../../index';
import RunHandler from '../index';

describe('plugins.runHandler', function () {
  test('should work', async function () {
    const handler = new Func({
      plugins: [new RunHandler()],
      handler (data: InvokeData) {
        return data.event + 1;
      }
    }).export().handler;

    expect(await handler(0)).toEqual(1);
    expect(await handler(1)).toEqual(2);
  });

  test('throw error', async function () {
    try {
      await new Func({
        plugins: [new RunHandler()],
        handler () {
          throw Error('wrong');
        }
      }).export().handler(0);
    } catch (error) {
      expect(error).toEqual(Error('wrong'));
    }
  });
});
