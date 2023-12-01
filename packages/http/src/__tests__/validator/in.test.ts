import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/in', () => {
  describe('params', () => {
    describe('normal', () => {
      test('should work', async () => {
        const http = new Http({
          validator: { params: { rules: { key: { in: [1] } } } },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":1}',
        })

        expect(res2.statusCode).toEqual(201)

        const res3 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":2}',
        })

        expect(res3.statusCode).toEqual(500)
        expect(res3.body).toEqual(
          '{"error":{"message":"[params] key must be in 1."}}'
        )
      })

      describe('onError', () => {
        test('no return', async () => {
          const http = new Http({
            validator: { params: { rules: { key: { in: [1] } } } },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key":2}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"[params] key must be in 1."}}'
          )
        })

        test('return message', async () => {
          const http = new Http({
            validator: {
              params: {
                rules: { key: { in: [1] } },
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
            body: '{"key":2}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"params.rule.in key 2"}}'
          )
        })

        test('return all', async () => {
          const http = new Http({
            validator: {
              params: {
                rules: { key: { in: [1] } },
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
            body: '{"key":2}',
          })

          expect(res.statusCode).toEqual(401)
          expect(res.body).toEqual(
            '{"error":{"message":"params.rule.in key 2"}}'
          )
        })
      })
    })

    describe('array', () => {
      test('should work', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({})

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":1}]}',
        })

        expect(res2.statusCode).toEqual(201)

        const res3 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":2}]}',
        })

        expect(res3.statusCode).toEqual(500)
        expect(res3.body).toEqual(
          '{"error":{"message":"[params] key.sub must be in 1."}}'
        )
      })

      describe('onError', () => {
        test('no return', async () => {
          const http = new Http({
            validator: {
              params: {
                rules: { key: { config: { rules: { sub: { in: [1] } } } } },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key":[{"sub":2}]}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"[params] key.sub must be in 1."}}'
          )
        })

        test('return message', async () => {
          const http = new Http({
            validator: {
              params: {
                rules: {
                  key: {
                    config: {
                      rules: { sub: { in: [1] } },
                      onError: (type, key, value) => ({
                        message: `${type} ${key} ${value}`,
                      }),
                    },
                  },
                },
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
            body: '{"key":[{"sub":2}]}',
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"params.rule.in key.sub 2"}}'
          )
        })

        test('return all', async () => {
          const http = new Http({
            validator: {
              params: {
                rules: {
                  key: {
                    config: {
                      rules: { sub: { in: [1] } },
                      onError: (type, key, value) => ({
                        statusCode: 401,
                        message: `${type} ${key} ${value}`,
                      }),
                    },
                  },
                },
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
            body: '{"key":[{"sub":2}]}',
          })

          expect(res.statusCode).toEqual(401)
          expect(res.body).toEqual(
            '{"error":{"message":"params.rule.in key.sub 2"}}'
          )
        })
      })
    })

    describe('object', () => {
      test('should work', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({})

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":1}}',
        })

        expect(res2.statusCode).toEqual(201)

        const res3 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":2}}',
        })

        expect(res3.statusCode).toEqual(500)
        expect(res3.body).toEqual(
          '{"error":{"message":"[params] key.sub must be in 1."}}'
        )
      })
    })

    describe('onError', () => {
      test('no return', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":2}}',
        })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(
          '{"error":{"message":"[params] key.sub must be in 1."}}'
        )
      })

      test('return message', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: { sub: { in: [1] } },
                    onError: (type, key, value) => ({
                      message: `${type} ${key} ${value}`,
                    }),
                  },
                },
              },
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
          body: '{"key":{"sub":2}}',
        })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(
          '{"error":{"message":"params.rule.in key.sub 2"}}'
        )
      })

      test('return all', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: { sub: { in: [1] } },
                    onError: (type, key, value) => ({
                      statusCode: 401,
                      message: `${type} ${key} ${value}`,
                    }),
                  },
                },
              },
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
          body: '{"key":{"sub":2}}',
        })

        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual(
          '{"error":{"message":"params.rule.in key.sub 2"}}'
        )
      })
    })
  })

  describe('cookie', () => {
    test('should work', async () => {
      const http = new Http({
        validator: { cookie: { rules: { key: { in: ['1'] } } } },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({})

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: 'key=1' },
      })

      expect(res2.statusCode).toEqual(201)

      const res3 = await handler({
        httpMethod: 'POST',
        headers: { cookie: 'key=2' },
      })

      expect(res3.statusCode).toEqual(500)
      expect(res3.body).toEqual(
        '{"error":{"message":"[cookie] key must be in 1."}}'
      )
    })

    describe('onError', () => {
      test('no return', async () => {
        const http = new Http({
          validator: { cookie: { rules: { key: { in: [1] } } } },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { cookie: 'key=2' },
        })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(
          '{"error":{"message":"[cookie] key must be in 1."}}'
        )
      })

      test('return message', async () => {
        const http = new Http({
          validator: {
            cookie: {
              rules: { key: { in: [1] } },
              onError: (type, key, value) => ({
                message: `${type} ${key} ${value}`,
              }),
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({
          httpMethod: 'POST',
          headers: { cookie: 'key=2' },
        })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual('{"error":{"message":"cookie.rule.in key 2"}}')
      })

      test('return all', async () => {
        const http = new Http({
          validator: {
            cookie: {
              rules: { key: { in: [1] } },
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
          headers: { cookie: 'key=2' },
        })

        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual('{"error":{"message":"cookie.rule.in key 2"}}')
      })
    })
  })

  describe('session', () => {
    test('normal', async () => {
      const http = new Http({
        validator: { session: { rules: { key: { in: [1] } } } },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: `key=${http.session.encode({ key: 1 })}` },
      })

      expect(res2.statusCode).toEqual(201)

      const res3 = await handler({
        httpMethod: 'POST',
        headers: { cookie: `key=${http.session.encode({ key: '1' })}` },
      })

      expect(res3.statusCode).toEqual(500)
      expect(res3.body).toEqual(
        '{"error":{"message":"[session] key must be in 1."}}'
      )
    })

    test('array', async () => {
      const http = new Http({
        validator: {
          session: {
            rules: { key: { config: { rules: { sub: { in: [1] } } } } },
          },
        },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({})

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: {
          cookie: `key=${http.session.encode({ key: [{ sub: 1 }] })}`,
        },
      })

      expect(res2.statusCode).toEqual(201)

      const res3 = await handler({
        httpMethod: 'POST',
        headers: {
          cookie: `key=${http.session.encode({ key: [{ sub: '1' }] })}`,
        },
      })

      expect(res3.statusCode).toEqual(500)
      expect(res3.body).toEqual(
        '{"error":{"message":"[session] key.sub must be in 1."}}'
      )
    })

    describe('object', () => {
      test('should work', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: { key: { config: { rules: { sub: { in: [1] } } } } },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({})

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({ key: { sub: 1 } })}`,
          },
        })

        expect(res2.statusCode).toEqual(201)

        const res3 = await handler({
          httpMethod: 'POST',
          headers: {
            cookie: `key=${http.session.encode({ key: { sub: '1' } })}`,
          },
        })

        expect(res3.statusCode).toEqual(500)
        expect(res3.body).toEqual(
          '{"error":{"message":"[session] key.sub must be in 1."}}'
        )
      })

      describe('onError', () => {
        test('no return', async () => {
          const http = new Http({
            validator: {
              session: {
                rules: { key: { config: { rules: { sub: { in: [1] } } } } },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          await handler({})

          const res = await handler({
            httpMethod: 'POST',
            headers: {
              cookie: `key=${http.session.encode({ key: { sub: '1' } })}`,
            },
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"[session] key.sub must be in 1."}}'
          )
        })

        test('return message', async () => {
          const http = new Http({
            validator: {
              session: {
                rules: {
                  key: {
                    config: {
                      rules: { sub: { in: [1] } },
                      onError: (type, key, value) => ({
                        message: `${type} ${key} ${value}`,
                      }),
                    },
                  },
                },
                onError: (type, key, value) => ({
                  message: `${type} ${key} ${value}`,
                }),
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          await handler({})

          const res = await handler({
            httpMethod: 'POST',
            headers: {
              cookie: `key=${http.session.encode({ key: { sub: '1' } })}`,
            },
          })

          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            '{"error":{"message":"session.rule.in key.sub 1"}}'
          )
        })

        test('return all', async () => {
          const http = new Http({
            validator: {
              session: {
                rules: {
                  key: {
                    config: {
                      rules: { sub: { in: [1] } },
                      onError: (type, key, value) => ({
                        statusCode: 401,
                        message: `${type} ${key} ${value}`,
                      }),
                    },
                  },
                },
                onError: (type, key, value) => ({
                  statusCode: 401,
                  message: `${type} ${key} ${value}`,
                }),
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          await handler({ httpMethod: 'POST' })

          const res = await handler({
            httpMethod: 'POST',
            headers: {
              cookie: `key=${http.session.encode({ key: { sub: '1' } })}`,
            },
          })

          expect(res.statusCode).toEqual(401)
          expect(res.body).toEqual(
            '{"error":{"message":"session.rule.in key.sub 1"}}'
          )
        })
      })
    })
  })
})
