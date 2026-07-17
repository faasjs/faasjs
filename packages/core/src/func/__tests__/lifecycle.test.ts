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

    it('shares mount across concurrent first invokes', async () => {
      let resolveMount!: () => void
      const mountGate = new Promise<void>((resolve) => {
        resolveMount = resolve
      })
      let mountTimes = 0
      let invokeTimes = 0

      class P implements Plugin {
        public readonly type = 'mount'
        public readonly name = 'concurrent-mount'

        public async onMount(_: MountData, next: Next) {
          mountTimes++
          await mountGate
          await next()
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: async () => ++invokeTimes,
      })
      const handler = func.export().handler

      const first = handler(null)
      const second = handler(null)

      expect(mountTimes).toBe(1)
      expect(invokeTimes).toBe(0)

      resolveMount()

      await expect(Promise.all([first, second])).resolves.toEqual([1, 2])
      expect(mountTimes).toBe(1)
      expect(invokeTimes).toBe(2)
    })

    it('shares mount failures and allows a later retry', async () => {
      let rejectMount!: () => void
      const mountGate = new Promise<void>((_, reject) => {
        rejectMount = () => reject(mountError)
      })
      const mountError = Error('mount failed')
      let mountTimes = 0

      class P implements Plugin {
        public readonly type = 'mount'
        public readonly name = 'retry-mount'

        public async onMount(_: MountData, next: Next) {
          mountTimes++

          if (mountTimes === 1) await mountGate

          await next()
        }
      }

      const func = new Func({
        plugins: [new P()],
        handler: async () => 1,
      })
      const handler = func.export().handler

      const first = handler(null)
      const second = handler(null)
      const failures = Promise.all([
        expect(first).rejects.toBe(mountError),
        expect(second).rejects.toBe(mountError),
      ])

      expect(mountTimes).toBe(1)

      rejectMount()
      await failures

      expect(func.mounted).toBe(false)
      expect(mountTimes).toBe(1)
      await expect(handler(null)).resolves.toBe(1)
      expect(func.mounted).toBe(true)
      expect(mountTimes).toBe(2)
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
