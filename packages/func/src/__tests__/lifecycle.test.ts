import { Func, Plugin, Next, MountData, InvokeData } from '../index';

describe('lifecycle', function () {
  describe('mount', function () {
    test('plugin throw error', async function () {
      class P implements Plugin {
        public readonly type: string;
        public readonly name: string;

        public async onMount () {
          throw Error('wrong');
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: () => 1
      });

      try {
        await func.export().handler(null);
      } catch (error) {
        expect(error.message).toEqual('wrong');
      }

      try {
        await func.export().handler(null);
      } catch (error) {
        expect(error.message).toEqual('wrong');
      }
    });

    test('mount called multiple times', async function () {
      let times = 0;

      class P implements Plugin {
        public readonly type: string;
        public readonly name: string;

        public async onMount (data: MountData, next: Next) {
          times++;
          await next();
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: () => 1
      });
      const handler = func.export().handler;

      await handler(null);
      expect(times).toEqual(1);

      await handler(null);
      expect(times).toEqual(1);

      await func.mount({
        event: null,
        context: null
      });
      expect(times).toEqual(1);
    });
  });

  describe('invoke', function () {
    test('plugin throw error', async function () {
      class P implements Plugin {
        public readonly type: string;
        public readonly name: string;

        public async onInvoke (data: InvokeData, next: Next) {
          data.event.headers.cookie;
          await next();
        }
      }

      const func = new Func({
        plugins: [new P(), new P()],
        handler: () => 1
      });

      try {
        await func.export().handler(null);
      } catch (error) {
        expect(error.message).toEqual('Cannot read property \'headers\' of null');
      }
    });
  });
});
