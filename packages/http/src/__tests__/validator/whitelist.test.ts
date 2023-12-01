import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/whitelist', () => {
  describe('params', () => {
    describe('normal', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            params: {
              whitelist: 'error',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":1,"key2":2,"key3":3}',
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[params] Not permitted keys: key2, key3"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            params: {
              whitelist: 'ignore',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.params
          },
        }).export().handler

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":1,"key2":2,"key3":3}',
        })

        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual('{"data":{"key":1}}')
      })

      describe('onError', () => {
        test('no return', async () => {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: { key: {} },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"[params] Not permitted keys: key1, key2"}}'
          )
        })

        test('return message', async () => {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: { key: {} },
                onError: (type, key, value) => ({
                  message: `${type} ${key} ${value}`,
                }),
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"params.whitelist  key1,key2"}}'
          )
        })

        test('return all', async () => {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: { key: {} },
                onError: (type, key, value) => ({
                  statusCode: 401,
                  message: `${type} ${key} ${value}`,
                }),
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}',
          })

          expect(res.statusCode).toEqual(401)
          expect(res.body).toEqual(
            '{"error":{"message":"params.whitelist  key1,key2"}}'
          )
        })
      })
    })

    describe('array', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":1}]}',
        })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"key1":1,"key2":2}]}',
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[params] Not permitted keys: key.key1, key.key2"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
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

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":1,"key":2}]}',
        })

        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual('{"data":[{"sub":1}]}')
      })
    })

    describe('object', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":1}}',
        })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"key1":1,"key2":2}}',
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[params] Not permitted keys: key.key1, key.key2"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
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

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":1,"key":2}}',
        })

        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual('{"data":{"sub":1}}')
      })
    })
  })

  describe('cookie', () => {
    test('error', async () => {
      const http = new Http({
        validator: {
          cookie: {
            whitelist: 'error',
            rules: { key: {} },
          },
        },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: 'key=1;key2=2;key3=3' },
      })

      expect(res2.statusCode).toEqual(500)
      expect(res2.body).toEqual(
        '{"error":{"message":"[cookie] Not permitted keys: key2, key3"}}'
      )
    })

    test('ignore', async () => {
      const http = new Http({
        validator: {
          cookie: {
            whitelist: 'ignore',
            rules: { key: {} },
          },
        },
      })
      const handler = new Func({
        plugins: [http],
        async handler() {
          return http.cookie.content
        },
      }).export().handler

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: 'key=1;key2=2;key3=3' },
      })

      expect(res2.statusCode).toEqual(200)
      expect(res2.body).toEqual('{"data":{"key":"1"}}')
    })
  })

  describe('session', () => {
    describe('normal', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            session: {
              whitelist: 'error',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({})

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: 1,
              key2: 2,
              key3: 3,
            })}`,
          },
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[session] Not permitted keys: key2, key3"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            session: {
              whitelist: 'ignore',
              rules: { key: {} },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.session.content
          },
        }).export().handler

        await handler({ httpMethod: 'POST' })

        const res = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: 1,
              key2: 2,
              key3: 3,
            })}`,
          },
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":{"key":1}}')
      })
    })

    describe('array', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        await handler({ httpMethod: 'POST' })

        const res = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({ key: [{ sub: 1 }] })}`,
          },
        })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: [
                {
                  key1: 1,
                  key2: 2,
                },
              ],
            })}`,
          },
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[session] Not permitted keys: key.key1, key.key2"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.session.content.key
          },
        }).export().handler

        await handler({ httpMethod: 'POST' })

        const res2 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: [
                {
                  sub: 1,
                  key: 2,
                },
              ],
            })}`,
          },
        })

        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual('{"data":[{"sub":1}]}')
      })
    })

    describe('object', () => {
      test('error', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        await handler({ httpMethod: 'POST' })

        const res = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({ key: { sub: 1 } })}`,
          },
        })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: {
                key1: 1,
                key2: 2,
              },
            })}`,
          },
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[session] Not permitted keys: key.key1, key.key2"}}'
        )
      })

      test('ignore', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: { sub: {} },
                  },
                },
              },
            },
          },
        })
        const handler = new Func({
          plugins: [http],
          async handler() {
            return http.session.content.key
          },
        }).export().handler

        await handler({ httpMethod: 'POST' })

        const res = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({
              key: {
                sub: 1,
                key: 2,
              },
            })}`,
          },
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual('{"data":{"sub":1}}')
      })
    })
  })
})
