import { describe, expect, it } from 'vitest'

import { createHttpFunc, createHttpHandler, expectBody } from './helpers'

describe('cookie', () => {
  describe('read', () => {
    const handler = createHttpHandler((data) => data.cookie.read(data.event.key))

    it('should work', async () => {
      let res = await handler({
        headers: { cookie: 'a=1; b=2' },
        key: 'a',
      })
      await expectBody(res, '{"data":"1"}')

      res = await handler({
        headers: { cookie: 'a=1; b=2' },
        key: 'b',
      })
      await expectBody(res, '{"data":"2"}')

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
    const handler = createHttpFunc(
      (data) => {
        data.cookie.write(data.event.key, data.event.value)
      },
      {
        config: { plugins: { http: { type: 'http' } } },
      },
    ).export().handler

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
      const handler = createHttpHandler(({ cookie }) => {
        cookie.write('k1', 'v1')
        cookie.write('k2', 'v2')
      })

      const res = await handler({})

      expect(res.headers['Set-Cookie']).toEqual([
        'k1=v1;max-age=31536000;path=/;Secure;HttpOnly;',
        'k2=v2;max-age=31536000;path=/;Secure;HttpOnly;',
      ])
    })
  })

  describe('cookie options', () => {
    it.each([
      {
        name: 'domain',
        config: { domain: 'domain.com' },
        value: null,
        expected: [
          'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;domain=domain.com;Secure;HttpOnly;',
        ],
      },
      {
        name: 'path',
        config: { path: '/path' },
        value: null,
        expected: ['key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/path;Secure;HttpOnly;'],
      },
      {
        name: 'sameSite',
        config: { sameSite: 'Lex' },
        value: null,
        expected: [
          'key=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;Secure;HttpOnly;SameSite=Lex;',
        ],
      },
      {
        name: 'expires number',
        config: { expires: 1 },
        value: '1',
        expected: ['key=1;max-age=1;path=/;Secure;HttpOnly;'],
      },
      {
        name: 'expires string',
        config: { expires: '1' },
        value: '1',
        expected: ['key=1;expires=1;path=/;Secure;HttpOnly;'],
      },
    ])('$name', async ({ config, expected, value }) => {
      const handler = createHttpFunc(
        ({ cookie }) => {
          cookie.write('key', value)
        },
        {
          config: {
            plugins: {
              http: {
                type: 'http',
                config: { cookie: config },
              },
            },
          },
        },
      ).export().handler

      const res = await handler({
        headers: {},
        key: 'key',
        value: null,
      })

      expect(res.headers['Set-Cookie']).toEqual(expected)
    })
  })
})
