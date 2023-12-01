import { Func, Plugin, Next, MountData, InvokeData } from '../index'

describe('lifecycle', () => {
  describe('mount', () => {
    test('plugin throw error', async () => {
      class P implements Plugin {
        public readonly type: string
        public readonly name: string

        public async onMount() {
          throw Error('wrong')
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: async () => 1,
      })

      try {
        await func.export().handler(null)
      } catch (error: any) {
        expect(error.message).toEqual('wrong')
      }

      try {
        await func.export().handler(null)
      } catch (error: any) {
        expect(error.message).toEqual('wrong')
      }
    })

    test('mount called multiple times', async () => {
      let times = 0

      class P implements Plugin {
        public readonly type: string
        public readonly name: string

        public async onMount(data: MountData, next: Next) {
          times++
          await next()
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: async () => 1,
      })
      const handler = func.export().handler

      await handler(null)
      expect(times).toEqual(1)

      await handler(null)
      expect(times).toEqual(1)

      await func.mount({
        event: null,
        context: null,
      })
      expect(times).toEqual(1)
    })
  })

  describe('invoke', () => {
    test('plugin throw error', async () => {
      class P implements Plugin {
        public readonly type: string
        public readonly name: string

        public async onInvoke(data: InvokeData, next: Next) {
          data.event.headers.cookie
          await next()
        }
      }

      const func = new Func({
        plugins: [new P(), new P()],
        handler: async () => 1,
      })

      try {
        await func.export().handler(null)
      } catch (error: any) {
        expect(error.message).toEqual(
          "Cannot read properties of null (reading 'headers')"
        )
      }
    })
  })
})
