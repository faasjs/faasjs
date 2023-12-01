import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/required', () => {
  describe('params', () => {
    test('normal', async () => {
      const http = new Http({
        validator: { params: { rules: { key: { required: true } } } },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual(
        '{"error":{"message":"[params] key is required."}}'
      )

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"key":1}',
      })

      expect(res2.statusCode).toEqual(201)
    })

    describe('onError', () => {
      test('no return', async () => {
        const http = new Http({
          validator: { params: { rules: { key: { required: true } } } },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(
          '{"error":{"message":"[params] key is required."}}'
        )
      })

      test('return message', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { required: true } },
              onError: (type, key, value) => ({
                message: `${type} ${key} ${value}`,
              }),
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(
          '{"error":{"message":"params.rule.required key undefined"}}'
        )
      })

      test('return all', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: { key: { required: true } },
              onError: (type, key, value) => ({
                statusCode: 401,
                message: `${type} ${key} ${value}`,
              }),
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual(
          '{"error":{"message":"params.rule.required key undefined"}}'
        )
      })
    })

    describe('array', () => {
      test('empty', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
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
          body: '{"key":[]}',
        })

        expect(res2.statusCode).toEqual(201)
      })

      test('plain object', async () => {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
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
          body: '{"key":[{}]}',
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[params] key.sub is required."}}'
        )
      })
    })

    test('object', async () => {
      const http = new Http({
        validator: {
          params: {
            rules: { key: { config: { rules: { sub: { required: true } } } } },
          },
        },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{"key":{}}',
      })

      expect(res2.statusCode).toEqual(500)
      expect(res2.body).toEqual(
        '{"error":{"message":"[params] key.sub is required."}}'
      )
    })
  })

  describe('cookie', () => {
    test('should work', async () => {
      const http = new Http({
        validator: { cookie: { rules: { key: { required: true } } } },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual(
        '{"error":{"message":"[cookie] key is required."}}'
      )

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: 'key=1' },
      })

      expect(res2.statusCode).toEqual(201)
    })
  })

  describe('session', () => {
    test('normal', async () => {
      const http = new Http({
        validator: { session: { rules: { key: { required: true } } } },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual(
        '{"error":{"message":"[session] key is required."}}'
      )

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: `key=${http.session.encode({ key: 1 })}` },
      })

      expect(res2.statusCode).toEqual(201)
    })

    describe('array', () => {
      test('empty', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { cookie: `key=${http.session.encode({ key: [] })}` },
        })

        expect(res2.statusCode).toEqual(201)
      })

      test('plain object', async () => {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: { config: { rules: { sub: { required: true } } } },
              },
            },
          },
        })
        const handler = new Func({ plugins: [http] }).export().handler

        const res = await handler({ httpMethod: 'POST' })

        expect(res.statusCode).toEqual(201)

        const res2 = await handler({
          httpMethod: 'POST',
          headers: { cookie: `key=${http.session.encode({ key: [{}] })}` },
        })

        expect(res2.statusCode).toEqual(500)
        expect(res2.body).toEqual(
          '{"error":{"message":"[session] key.sub is required."}}'
        )
      })
    })

    test('object', async () => {
      const http = new Http({
        validator: {
          session: {
            rules: { key: { config: { rules: { sub: { required: true } } } } },
          },
        },
      })
      const handler = new Func({ plugins: [http] }).export().handler

      const res = await handler({ httpMethod: 'POST' })

      expect(res.statusCode).toEqual(201)

      const res2 = await handler({
        httpMethod: 'POST',
        headers: { cookie: `key=${http.session.encode({ key: {} })}` },
      })

      expect(res2.statusCode).toEqual(500)
      expect(res2.body).toEqual(
        '{"error":{"message":"[session] key.sub is required."}}'
      )
    })
  })
})
