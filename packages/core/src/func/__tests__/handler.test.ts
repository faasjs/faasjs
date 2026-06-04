import { describe, expect, it } from 'vitest'

import { Func, type FuncRuntime } from '../..'

describe('Func handler', () => {
  it('without handler', async () => {
    const handler = new Func({}).export().handler

    expect(await handler(0)).toBeUndefined()
  })

  describe('with handler', () => {
    it('should work', async () => {
      const handler = new Func<number>({
        async handler(data) {
          return data.event + 1
        },
      }).export().handler

      expect(await handler(0)).toEqual(1)
      expect(await handler(1)).toEqual(2)
    })

    it('adds configured runtime to context', async () => {
      const handler = new Func<undefined, { runtime?: FuncRuntime }>({
        runtime: 'job',
        async handler(data) {
          return data.context.runtime
        },
      }).export().handler

      expect(await handler(undefined, {})).toEqual('job')
    })

    it('overrides caller runtime in context', async () => {
      const handler = new Func<undefined, { runtime?: FuncRuntime }>({
        runtime: 'api',
        async handler(data) {
          return data.context.runtime
        },
      }).export().handler

      expect(await handler(undefined, { runtime: 'job' })).toEqual('api')
    })

    it('throw handler', async () => {
      const handler = new Func({
        async handler() {
          throw Error('Error')
        },
      }).export().handler

      await expect(handler({}, {})).rejects.toEqual(Error('Error'))
    })
  })
})
