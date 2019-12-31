import { Func, InvokeData } from '../index';

describe('handler', function () {
  test('no handler', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(() => new Func({})).toThrowError('Unknown handler');
  });

  describe('createHanlder', function () {
    test('should work', async function () {
      const handler = new Func({
        handler (data: InvokeData) {
          return data.event + 1;
        }
      }).export().handler;

      expect(await handler(0)).toEqual(1);
      expect(await handler(1)).toEqual(2);
    });

    test('throw handler', async function () {
      const handler = new Func({
        handler () {
          throw Error('Error');
        }
      }).export().handler;

      try {
        await handler({}, {});
      } catch (error) {
        expect(error).toEqual(Error('Error'));
      }
    });
  });
});
