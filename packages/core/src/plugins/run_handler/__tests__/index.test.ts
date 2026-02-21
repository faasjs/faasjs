import { describe, expect, it } from 'vitest'
import { RunHandler } from '..'
import { Func, type InvokeData } from '../../..'

describe('plugins.runHandler', () => {
  it('return result', async () => {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler(data: InvokeData) {
        return data.event + 1
      },
    }).export().handler

    expect(await handler(0)).toEqual(1)
    expect(await handler(1)).toEqual(2)
  })

  it('async return result', async () => {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler(data: InvokeData) {
        return await Promise.resolve(data.event + 1)
      },
    }).export().handler

    expect(await handler(0)).toEqual(1)
    expect(await handler(1)).toEqual(2)
  })

  it('callback result', async () => {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler(data: InvokeData) {
        data.callback(null, data.event + 1)
      },
    }).export().handler

    expect(await handler(0)).toEqual(1)
    expect(await handler(1)).toEqual(2)
  })

  it('async callback result', async () => {
    const handler = new Func({
      plugins: [new RunHandler()],
      async handler(data: InvokeData) {
        await new Promise<void>((resolve) => {
          data.callback(null, data.event + 1)
          resolve()
        })
      },
    }).export().handler

    expect(await handler(0)).toEqual(1)
    expect(await handler(1)).toEqual(2)
  })

  it('throw error', async () => {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler() {
          throw Error('wrong')
        },
      })
        .export()
        .handler(0)
    } catch (error) {
      expect(error).toEqual(Error('wrong'))
    }
  })

  it('async throw error', async () => {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler() {
          return await Promise.reject(Error('wrong'))
        },
      })
        .export()
        .handler(0)
    } catch (error) {
      expect(error).toEqual(Error('wrong'))
    }
  })

  it('callback error', async () => {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler(data: InvokeData) {
          data.callback(Error('wrong'))
        },
      })
        .export()
        .handler(0)
    } catch (error) {
      expect(error).toEqual(Error('wrong'))
    }
  })

  it('async callback error', async () => {
    try {
      await new Func({
        plugins: [new RunHandler()],
        async handler(data: InvokeData) {
          await new Promise<void>((resolve) => {
            data.callback(Error('wrong'))
            resolve()
          })
        },
      })
        .export()
        .handler(0)
    } catch (error) {
      expect(error).toEqual(Error('wrong'))
    }
  })
})
