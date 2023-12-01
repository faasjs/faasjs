import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/default', () => {
  describe('params', () => {
    describe('normal', () => {
      test('const', async () => {
        const http = new Http<{ key: number; value: string }>({
          validator: { params: { rules: { key: { default: 1 } } } },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":1}')
      })

      test('function', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: { default: (request: any) => request.params.i + 1 },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"i":1}',
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":2}')
      })
    })

    describe('array', () => {
      test('const', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { config: { rules: { sub: { default: 1 } } } } },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{}]}',
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":[{"sub":1}]}')
      })

      test('function', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: { default: (request: any) => request.params.i + 1 },
                    },
                  },
                },
              },
            },
          },
        })

        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{}],"i":1}',
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":[{"sub":2}]}')
      })
    })

    describe('object', () => {
      test('const', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { config: { rules: { sub: { default: 1 } } } } },
            },
          },
        })

        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{}}',
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":{"sub":1}}')
      })

      test('function', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: { default: (request: any) => request.params.i + 1 },
                    },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params.key
          },
        }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{},"i":1}',
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":{"sub":2}}')
      })
    })
  })

  test('cookie should not work', async () => {
    const http = new Http({
      validator: { cookie: { rules: { key: { default: 1 } } } },
    })
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.cookie.content
      },
    }).export().handler

    const res = await handler({ httpMethod: 'POST' })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual('{"data":{}}')
  })

  test('session should not work', async () => {
    const http = new Http({
      validator: { session: { rules: { key: { default: 1 } } } },
    })
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.session.content
      },
    }).export().handler

    const res = await handler({
      httpMethod: 'POST',
      headers: { cookie: 'key=value' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual('{"data":{}}')
  })
})
