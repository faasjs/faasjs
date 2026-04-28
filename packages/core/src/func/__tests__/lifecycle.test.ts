import { describe, expect, it } from 'vitest'

import { Func, type InvokeData, type MountData, type Next, type Plugin } from '../..'

describe('lifecycle', () => {
  describe('mount', () => {
    it('plugin throw error', async () => {
      class P implements Plugin {
        public readonly type = 'mount'
        public readonly name = 'throw-error'

        public async onMount() {
          throw Error('wrong')
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: async () => 1,
      })

      await expect(func.export().handler(null)).rejects.toThrow('wrong')
      await expect(func.export().handler(null)).rejects.toThrow('wrong')
    })

    it('mount called multiple times', async () => {
      let times = 0

      class P implements Plugin {
        public readonly type = 'mount'
        public readonly name = 'mount-once'

        public async onMount(_: MountData, next: Next) {
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
    it('plugin throw error', async () => {
      class P implements Plugin {
        public readonly type = 'invoke'
        public readonly name = 'invoke-error'

        public async onInvoke(data: InvokeData, next: Next) {
          if (data.event.headers.cookie) {
            // noop
          }
          await next()
        }
      }

      const func = new Func({
        plugins: [new P(), new P()],
        handler: async () => 1,
      })

      const error = await func
        .export()
        .handler(null)
        .catch((error: any) => error)

      expect(error.message).toBe("Cannot read properties of undefined (reading 'cookie')")
    })
  })
})
