import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { CloudFunction, invoke, invokeSync, useCloudFunction } from '..'

describe('cloud_function', () => {
  it('should work', async () => {
    const cf = new CloudFunction()

    const handler = new Func({
      plugins: [cf],
      async handler() {
        return cf.event.key
      },
    }).export().handler

    const res = await handler({ key: 1 })

    expect(res).toEqual(1)
  })

  it('invoke', async () => {
    const cf = new CloudFunction()

    const handler = new Func({
      plugins: [cf],
      async handler() {
        return cf.invoke(`${__dirname}/funcs/test`, { key: 1 })
      },
    }).export().handler

    const res = await handler({})

    expect(res).toMatchObject({ event: { key: 1 } })

    expect(await invoke(`${__dirname}/funcs/test`, { key: 1 })).toMatchObject({
      event: { key: 1 },
    })

    expect(await useCloudFunction().invoke(`${__dirname}/funcs/test`, { key: 1 })).toMatchObject({
      event: { key: 1 },
    })
  })

  it('invokeSync', async () => {
    const cf = new CloudFunction()

    const handler = new Func({
      plugins: [cf],
      async handler() {
        return cf.invokeSync(`${__dirname}/funcs/test`, { key: 1 })
      },
    }).export().handler

    const res = await handler({})

    expect(res).toMatchObject({ event: { key: 1 } })

    expect(await invokeSync(`${__dirname}/funcs/test`, { key: 1 })).toMatchObject({
      event: { key: 1 },
    })

    expect(await useCloudFunction().invokeSync(`${__dirname}/funcs/test`, { key: 1 })).toMatchObject({
      event: { key: 1 },
    })
  })
})
