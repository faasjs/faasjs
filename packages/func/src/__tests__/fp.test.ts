import { Plugin, useFunc, usePlugin, InvokeData, Next, MountData } from '..'

describe('fp', () => {
  it('should work', async () => {
    class DemoPlugin implements Plugin {
      public readonly type = 'P'
      public readonly name = 'P'

      public async onInvoke(data: InvokeData, next: Next) {
        data.event.counter++
        await next()
      }

      public async onMount(data: MountData, next: Next) {
        data.event.counter++
        await next()
      }
    }

    function useDemoPlugin() {
      const p = new DemoPlugin()
      usePlugin(p)
      return p
    }

    const func = useFunc<{ counter: number }, any, number>(() => {
      useDemoPlugin()
      return async ({ event }) => {
        event.counter++
        return event.counter
      }
    })

    expect(func.plugins.length).toEqual(2)
    expect(func.plugins[0]).toBeInstanceOf(DemoPlugin)

    const res = await func.export().handler({ counter: 0 })

    expect(res).toEqual(3) // incremented by onMount and onInvoke

    const res2 = await func.export().handler({ counter: 0 })

    expect(res2).toEqual(2) // incremented by onInvoke only

    const func2 = useFunc(() => {
      useDemoPlugin()
      return async ({ event }) => {
        event.counter--
        return event.counter
      }
    })

    const res3 = await func2.export().handler({ counter: 0 })

    expect(res3).toEqual(1)
  })

  it('same plugin with different config', async () => {
    class DemoPlugin implements Plugin {
      public readonly type = 'P'
      public readonly name = 'P'
      private key: string

      constructor({
        key,
      }: {
        key: string
      }) {
        this.key = key
      }

      public async onInvoke(data: InvokeData, next: Next) {
        if (!data.event[this.key]) data.event[this.key] = 0
        data.event[this.key]++
        await next()
      }
    }

    function useDemoPlugin(config: { key: string }) {
      const p = new DemoPlugin(config)
      usePlugin(p)
      return p
    }

    const funcA = useFunc(() => {
      useDemoPlugin({ key: 'A' })
      return async ({ event }) => event
    }).export().handler

    const funcB = useFunc(() => {
      useDemoPlugin({ key: 'B' })
      return async ({ event }) => event
    }).export().handler

    const resA = await funcA({})
    const resB = await funcB({})

    expect(resA).toEqual({ A: 1 })
    expect(resB).toEqual({ B: 1 })
  })

  it('different plugins', async () => {
    class A implements Plugin {
      public readonly type = 'A'
      public readonly name = 'A'
      private key: string

      constructor({
        key,
      }: {
        key: string
      }) {
        this.key = key
      }

      public async onInvoke(data: InvokeData, next: Next) {
        if (!data.event[this.key]) data.event[this.key] = 0
        data.event[this.key]++
        await next()
      }
    }

    class B implements Plugin {
      public readonly type = 'B'
      public readonly name = 'B'
      private key: string

      constructor({
        key,
      }: {
        key: string
      }) {
        this.key = key
      }

      public async onInvoke(data: InvokeData, next: Next) {
        if (!data.event[this.key]) data.event[this.key] = 0
        data.event[this.key]++
        await next()
      }
    }

    function useA(config: { key: string }) {
      const p = new A(config)
      usePlugin(p)
      return p
    }

    function useB(config: { key: string }) {
      const p = new B(config)
      usePlugin(p)
      return p
    }

    const func = useFunc<{ counter: number }, any, number>(() => {
      useA({ key: 'counter' })
      useB({ key: 'counter' })

      return async ({ event }) => {
        event.counter++
        return event.counter
      }
    })

    expect(func.plugins.length).toEqual(3)
    expect(func.plugins[0]).toBeInstanceOf(A)
    expect(func.plugins[1]).toBeInstanceOf(B)

    const res = await func.export().handler({ counter: 0 })

    expect(res).toEqual(3)
  })
})
