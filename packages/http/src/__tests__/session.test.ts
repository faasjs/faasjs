import { Func, type InvokeData } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { Http } from '..'
import { Session } from '../session'

describe('session', () => {
  describe('read', () => {
    const http = new Http()
    const func = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        return http.session.read(data.event.key)
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

      expect(res.body).toEqual('{"data":"value"}')
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
  })

  describe('write', () => {
    const http = new Http()
    const func = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        http.session.write(data.event.key, data.event.value)
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
    const session = new Session(http.cookie, {
      key: 'key',
      secret: 'secret',
    })

    it('add', async () => {
      const res = await handler({
        key: 'key',
        value: 'value',
        headers: {},
      })

      expect(
        session.decode(
          res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]
        )
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
        session.decode(
          res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]
        )
      ).toEqual({})
    })

    it('multi change', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.session.write('a', 1)
          http.session.write('a', 2)
          http.session.write('b', 1)
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
        session.decode(
          res.headers['Set-Cookie'][0].match('(^|;)\\s*key\\s*=\\s*([^;]+)')[2]
        )
      ).toEqual({
        a: 2,
        b: 1,
      })
    })
  })
})
