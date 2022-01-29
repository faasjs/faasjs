import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/regexp', function () {
  describe('param', function () {
    describe('normal', function () {
      test('should work', async function () {
        const http = new Http({ validator: { params: { rules: { key: { regexp: /\d+/ } } } }, })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)
        const res2 = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":1}',
        })
        expect(res2.statusCode).toEqual(201)
      })
      describe('onError', function () {
        test('no return', async function () {
          const http = new Http({ validator: { params: { rules: { key: { regexp: /^12345678$/ } } } }, })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key":1}',
          })
          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            `{"error":{"message":"[params] key must match ${/^12345678$/}."}}`
          )
        })
        test('return', async function () {
          const http = new Http({
            validator: {
              params: {
                rules: { key: { regexp: /1233/ } },
                onError: function (type, key, value) {
                  return { message: `${type} ${key} ${value}` }
                },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({ httpMethod: 'POST' })

          expect(res.statusCode).toEqual(201)
          const res2 = await handler({
            httpMethod: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{"key":2}',
          })
          expect(res2.statusCode).toEqual(500)
          expect(res2.body).toEqual(
            '{"error":{"message":"params.rule.regexp key 2"}}'
          )
        })
      })
    })
  })
  describe('cookie', function () {
    describe('normal', function () {
      test('should work', async function () {
        const http = new Http({ validator: { cookie: { rules: { key: { regexp: /\d+/ } } } }, })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)
        const res2 = await handler({
          httpMethod: 'POST',
          headers: { cookie: 'key=1' },
        })
        expect(res2.statusCode).toEqual(201)
      })
      describe('onError', function () {
        test('onError', async function () {
          const http = new Http({ validator: { cookie: { rules: { key: { regexp: /^12345678$/ } } } }, })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({
            httpMethod: 'POST',
            headers: { cookie: 'key=1' },
          })
          expect(res.statusCode).toEqual(500)
          expect(res.body).toEqual(
            `{"error":{"message":"[cookie] key must match ${/^12345678$/}."}}`
          )
        })
        test('return', async function () {
          const http = new Http({
            validator: {
              cookie: {
                rules: { key: { regexp: /1233/ } },
                onError: function (type, key, value) {
                  return { message: `${type} ${key} ${value}` }
                },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({ httpMethod: 'POST' })

          expect(res.statusCode).toEqual(201)

          const res2 = await handler({
            httpMethod: 'POST',
            headers: { cookie: 'key=1}' },
          })
          expect(res2.statusCode).toEqual(500)
          expect(res2.body).toEqual(
            '{"error":{"message":"cookie.rule.regexp key 1}"}}'
          )
        })
      })
    })
  })
  describe('session', function () {
    describe('normal', function () {
      test('should work', async function () {
        const http = new Http({ validator: { session: { rules: { key: { regexp: /\d+/ } } } }, })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)
        const res2 = await handler({
          httpMethod: 'POST',
          headers: { cookie: `key=${http.session.encode({ key: 1 })}` },
        })
        expect(res2.statusCode).toEqual(201)
      })
      describe('onError', function () {
        test('no return', async function () {
          const http = new Http({ validator: { session: { rules: { key: { regexp: /1233/ } } } }, })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({ httpMethod: 'POST' })

          expect(res.statusCode).toEqual(201)

          const res2 = await handler({
            httpMethod: 'POST',
            headers: { cookie: `key=${http.session.encode({ key: 1 })}` },
          })
          expect(res2.statusCode).toEqual(500)
          expect(res2.body).toEqual(
            `{"error":{"message":"[session] key must match ${/1233/}."}}`
          )
        })
        test('return', async function () {
          const http = new Http({
            validator: {
              session: {
                rules: { key: { regexp: /1233/ } },
                onError: function (type, key, value) {
                  return { message: `${type} ${key} ${value}` }
                },
              },
            },
          })
          const handler = new Func({ plugins: [http] }).export().handler

          const res = await handler({ httpMethod: 'POST' })

          expect(res.statusCode).toEqual(201)

          const res2 = await handler({
            httpMethod: 'POST',
            headers: { cookie: `key=${http.session.encode({ key: 1 })}` },
          })
          expect(res2.statusCode).toEqual(500)
          expect(res2.body).toEqual(
            '{"error":{"message":"session.rule.regexp key 1"}}'
          )
        })
      })
    })
  })
})
