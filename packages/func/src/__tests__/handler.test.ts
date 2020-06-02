import { Func, InvokeData } from '../index';

describe('Func handler', function () {
  test('without handler', async function () {
    const handler = new Func({}).export().handler;

    expect(await handler(0)).toBeUndefined();
  });

  describe('with handler', function () {
    test('should work', async function () {
      const handler = new Func({
        handler (data: InvokeData<number>): number {
          return data.event + 1;
        }
      }).export().handler;

      expect(await handler(0)).toEqual(1);
      expect(await handler(1)).toEqual(2);
    });

    test('throw handler', async function () {
      const handler = new Func({
        handler (): void {
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
