import { streamToString } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import { Cookie, Http } from '..'
import { Func, type InvokeData } from '../../..'

describe('session', () => {
  describe('read', () => {
    const http = new Http()
    const func = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        return data.session.read(data.event.key)
      },
    })
    func.config = {
      plugins: {
        http: {
          type: 'http',
          config: {
            cookie: {
              session: {
                key: 'key',
                secret: 'secret',
              },
            },
          },
        },
      },
    }
    const handler = func.export().handler

    it('return value', async () => {
      const res = await handler({
        headers: {
          cookie:
            'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6; ',
        },
        key: 'key',
      })

      expect(res.body).toBeInstanceOf(ReadableStream)
      expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":"value"}')
    })

    it('no value', async () => {
      const res = await handler({
        headers: {
          cookie:
            'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6; ',
        },
        key: 'null',
      })

      expect(res.body).toBeUndefined()
    })

    it('no key', async () => {
      const res = await handler({
        headers: { cookie: '' },
        key: 'key',
      })

      expect(res.body).toBeUndefined()
    })

    it('wrong session', async () => {
      const res = await handler({
        headers: { cookie: 'key=key' },
        key: 'key',
      })

      expect(res.body).toBeUndefined()
    })

    it('isolates session between concurrent requests', async () => {
      let pending = 0
      let release: (() => void) | undefined
      const ready = new Promise<void>((resolve) => {
        release = resolve
      })

      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler(data: InvokeData) {
          const first = data.session.read('value')

          pending += 1
          if (pending === 2) release?.()

          await ready

          return {
            first,
            seen: data.session.read('value'),
          }
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: {
              cookie: {
                session: {
                  key: 'key',
                  secret: 'secret',
                },
              },
            },
          },
        },
      }

      const handler = func.export().handler
      const session = new Cookie({
        session: {
          key: 'key',
          secret: 'secret',
        },
      }).session
      const createCookie = (value: string) =>
        `key=${encodeURIComponent(session.encode({ value }))};`

      const [resA, resB] = await Promise.all([
        handler({
          headers: {
            cookie: createCookie('A'),
          },
        }),
        handler({
          headers: {
            cookie: createCookie('B'),
          },
        }),
      ])

      expect(await streamToString(resA.body as ReadableStream)).toEqual(
        '{"data":{"first":"A","seen":"A"}}',
      )
      expect(await streamToString(resB.body as ReadableStream)).toEqual(
        '{"data":{"first":"B","seen":"B"}}',
      )
    })
  })

  describe('write', () => {
    const http = new Http()
    const func = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        data.session.write(data.event.key, data.event.value)
      },
    })
    func.config = {
      plugins: {
        http: {
          type: 'http',
          config: {
            cookie: {
              session: {
                key: 'key',
                secret: 'secret',
              },
            },
          },
        },
      },
    }
    const handler = func.export().handler
    const session = new Cookie({
      session: {
        key: 'key',
        secret: 'secret',
      },
    }).session

    it('add', async () => {
      const res = await handler({
        key: 'key',
        value: 'value',
        headers: {},
      })

      expect(
        session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]),
      ).toEqual({ key: 'value' })
    })

    it('delete', async () => {
      const res = await handler({
        key: 'key',
        value: null,
        headers: {
          cookie:
            'key=YUwxU1dBMDc5anlDemY3SHhPSDhHUT09LS1BdGJTSzdHSzhsRGJCcDlMZ05lK0ZnPT0=--6a5edb5edffc49259127b2268a82061f8937b742f541df6ccb283b5ca0e312d6;',
        },
      })

      expect(
        session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]),
      ).toEqual({})
    })

    it('multi change', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler({ session }) {
          session.write('a', 1)
          session.write('a', 2)
          session.write('b', 1)
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: {
              cookie: {
                session: {
                  key: 'key',
                  secret: 'secret',
                },
              },
            },
          },
        },
      }
      const handler = func.export().handler

      const res = await handler({
        key: 'key',
        value: null,
      })

      expect(
        session.decode(res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]),
      ).toEqual({
        a: 2,
        b: 1,
      })
    })
  })
})
