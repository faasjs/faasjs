import { Redis, useRedis, query, get, set, setJSON, getJSON } from '../index'
import { Func, useFunc } from '@faasjs/func'

describe('redis', () => {
  afterEach(async () => {
    await useRedis().quit()
  })

  it('config with code', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.query('set', ['key', 'value'])
        return redis.query('get', ['key'])
      },
    })

    const handler = func.export().handler

    expect(await handler({})).toEqual('value')
  })

  it('config with env', async () => {
    process.env.SECRET_REDIS_SOCKET_HOST = 'localhost'

    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.query('set', ['key', 'value'])
        return redis.query('get', ['key'])
      },
    })

    const handler = func.export().handler

    expect(await handler({})).toEqual('value')
  })

  it('useRedis', async () => {
    const func = useFunc(() => {
      const redis1 = useRedis()
      return async () => {
        await redis1.query('set', ['key', 'redis1'])

        const redis2 = useRedis()
        await redis2.query('set', ['key', 'redis2'])

        return query('get', ['key'])
      }
    })

    expect(await func.export().handler({})).toEqual('redis2')
  })

  it('query error', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.query('wrong', [])
      },
    })

    try {
      await func.export().handler({})
    } catch (error: any) {
      expect(error.message).toEqual(
        "ERR unknown command 'wrong', with args beginning with: "
      )
    }
  })

  it('get & set', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.set('key', 'value')
        return redis.get('key')
      },
    })

    expect(await func.export().handler({})).toEqual('value')
  })

  it('get & set with fp', async () => {
    const func = useFunc(() => {
      useRedis()

      return async () => {
        await set('key', 'value')
        return get('key')
      }
    })

    expect(await func.export().handler({})).toEqual('value')
  })

  it('getJSON & setJSON', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.setJSON('key', {})
        return redis.getJSON('key')
      },
    })

    expect(await func.export().handler({})).toEqual({})
  })

  it('getJSON & setJSON with fp', async () => {
    const func = useFunc(() => {
      useRedis()

      return async () => {
        await setJSON('key', {})
        return getJSON('key')
      }
    })

    expect(await func.export().handler({})).toEqual({})
  })

  it('set with options', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.set('key', 'value', { EX: 1 })
        await redis.set('key', 'value', { PX: 1 })
        await redis.set('key', 'value', { EXAT: 1 })
        await redis.set('key', 'value', { PXAT: 1 })
        await redis.set('key', 'value', { KEEPTTL: true })
        await redis.set('key', 'value', { NX: true })
        await redis.set('key', 'value', { XX: true })
        await redis.set('key', 'value', { GET: true })
        return redis.get('key')
      },
    })

    expect(await func.export().handler({})).toEqual('value')
  })

  it('multi', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.multi().set('key', 'value').exec()

        return redis.get('key')
      },
    })

    expect(await func.export().handler({})).toEqual('value')
  })

  it('pipeline', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        await redis.pipeline().set('key', 'value').exec()

        return redis.get('key')
      },
    })

    expect(await func.export().handler({})).toEqual('value')
  })

  it('lock', async () => {
    const redis = new Redis()

    const func = new Func({
      plugins: [redis],
      async handler() {
        return await redis.lock('key')
      },
    }).export().handler

    await func({})

    expect(async () => await func({})).rejects.toThrow(
      Error('[redis] lock failed: key')
    )

    await redis.unlock('key')

    expect(await func({})).toBeUndefined()
  })
})
