import { Func, InvokeData } from '../../../index';
import RunHandler from '../index';

describe('plugins.runHandler', function () {
  test('return result', async function () {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler (data: InvokeData) {
        return data.event + 1;
      }
    }).export().handler;

    expect(await handler(0)).toEqual(1);
    expect(await handler(1)).toEqual(2);
  });

  test('async return result', async function () {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler (data: InvokeData) {
        return Promise.resolve(data.event + 1);
      }
    }).export().handler;

    expect(await handler(0)).toEqual(1);
    expect(await handler(1)).toEqual(2);
  });

  test('callback result', async function () {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler (data: InvokeData) {
        data.callback(null, data.event + 1);
      }
    }).export().handler;

    expect(await handler(0)).toEqual(1);
    expect(await handler(1)).toEqual(2);
  });

  test('async callback result', async function () {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler (data: InvokeData) {
        await new Promise<void>(function (resolve) {
          data.callback(null, data.event + 1);
          resolve();
        });
      }
    }).export().handler;

    expect(await handler(0)).toEqual(1);
    expect(await handler(1)).toEqual(2);
  });

  test('throw error', async function () {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler () {
          throw Error('wrong');
        }
      }).export().handler(0);
    } catch (error) {
      expect(error).toEqual(Error('wrong'));
    }
  });

  test('async throw error', async function () {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler () {
          return Promise.reject(Error('wrong'));
        }
      }).export().handler(0);
    } catch (error) {
      expect(error).toEqual(Error('wrong'));
    }
  });

  test('callback error', async function () {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler (data: InvokeData) {
          data.callback(Error('wrong'));
        }
      }).export().handler(0);
    } catch (error) {
      expect(error).toEqual(Error('wrong'));
    }
  });

  test('async callback error', async function () {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler (data: InvokeData) {
          await new Promise<void>(function (resolve) {
            data.callback(Error('wrong'));
            resolve();
          });
        }
      }).export().handler(0);
    } catch (error) {
      expect(error).toEqual(Error('wrong'));
    }
  });
});
