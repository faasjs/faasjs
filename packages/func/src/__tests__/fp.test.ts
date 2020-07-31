import { Plugin, useFunc, usePlugin, InvokeData, Next } from '..';

describe('fp', function () {
  it('should work', async function () {
    class DemoPlugin implements Plugin {
      public readonly type = 'P';
      public async onInvoke (data: InvokeData, next: Next) {
        data.event.counter ++;
        await next();
      }
    }

    function useDemoPlugin () {
      const p = new DemoPlugin();
      usePlugin(p);
      return p;
    }

    const func = useFunc(function () {
      useDemoPlugin();
      return function ({ event }) {
        event.counter ++;
        return event.counter;
      };
    });

    expect(func.plugins.length).toEqual(2);
    expect(func.plugins[0]).toBeInstanceOf(DemoPlugin);

    const res = await func.export().handler({ counter: 0 });

    expect(res).toEqual(2);

    const func2 = useFunc(function () {
      useDemoPlugin();
      return function ({ event }) {
        event.counter --;
        return event.counter;
      };
    });

    const res2 = await func2.export().handler({ counter: 0 });

    expect(res2).toEqual(0);
  });
});
