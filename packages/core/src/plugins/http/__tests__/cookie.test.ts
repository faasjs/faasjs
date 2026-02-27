import { streamToString } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { Func, type InvokeData } from '../../..'
import { Http } from '..'

describe('cookie', () => {
  describe('read', () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        return http.cookie.read(data.event.key)
      },
    }).export().handler

    it('should work', async () => {
      let res = await handler({
        headers: { cookie: 'a=1; b=2' },
        key: 'a',
      })
      expect(res.body).toBeInstanceOf(ReadableStream)
      expect(await streamToString(res.body)).toEqual('{"data":"1"}')

      res = await handler({
        headers: { cookie: 'a=1; b=2' },
        key: 'b',
      })
      expect(res.body).toBeInstanceOf(ReadableStream)
      expect(await streamToString(res.body)).toEqual('{"data":"2"}')

      res = await handler({
        headers: { cookie: 'a=1; b=2' },
        key: 'c',
      })
      expect(res.statusCode).toEqual(204)
      expect(res.body).toBeUndefined()
    })

    it('no cookie', async () => {
      const res = await handler({
        headers: {},
        key: 'a',
      })

      expect(res.body).toBeUndefined()
    })
  })

  describe('write', () => {
    const http = new Http()
    const func = new Func({
      plugins: [http],
      async handler(data: InvokeData) {
        http.cookie.write(data.event.key, data.event.value)
      },
    })
    func.config = {
      plugins: { http: { type: 'http' } },
    }
    const handler = func.export().handler

    it('base', async () => {
      const res = await handler({
        headers: {},
        key: 'key',
        value: 'value',
      })

      expect(res.headers['Set-Cookie']).toEqual([
        'key=value;max-age=31536000;path=/;Secure;HttpOnly;',
      ])
    })

    it('delete', async () => {
      const res = await handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual([
        'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure;HttpOnly;',
      ])
    })

    it('write multi keys', async () => {
      const http = new Http()
      const handler = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('k1', 'v1')
          http.cookie.write('k2', 'v2')
        },
      }).export().handler

      const res = await handler({})

      expect(res.headers['Set-Cookie']).toEqual([
        'k1=v1;max-age=31536000;path=/;Secure;HttpOnly;',
        'k2=v2;max-age=31536000;path=/;Secure;HttpOnly;',
      ])
    })
  })

  describe('cookie options', () => {
    it('domain', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('key', null)
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: { cookie: { domain: 'domain.com' } },
          },
        },
      }
      const res = await func.export().handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual([
        'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=domain.com;Secure;HttpOnly;',
      ])
    })

    it('path', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('key', null)
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: { cookie: { path: '/path' } },
          },
        },
      }
      const res = await func.export().handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual([
        'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/path;Secure;HttpOnly;',
      ])
    })

    it('sameSite', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('key', null)
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: { cookie: { sameSite: 'Lex' } },
          },
        },
      }
      const res = await func.export().handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual([
        'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure;HttpOnly;SameSite=Lex;',
      ])
    })

    it('expires number', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('key', '1')
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: { cookie: { expires: 1 } },
          },
        },
      }
      const res = await func.export().handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual(['key=1;max-age=1;path=/;Secure;HttpOnly;'])
    })

    it('expires string', async () => {
      const http = new Http()
      const func = new Func({
        plugins: [http],
        async handler() {
          http.cookie.write('key', '1')
        },
      })
      func.config = {
        plugins: {
          http: {
            type: 'http',
            config: { cookie: { expires: '1' } },
          },
        },
      }
      const res = await func.export().handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual(['key=1;expires=1;path=/;Secure;HttpOnly;'])
    })
  })
})
