import { Func } from '@faasjs/func'
import { Http } from '../..'

describe('validator/before', () => {
  test('return error', async () => {
    const http = new Http({
      validator: {
        async before(request) {
          if (!request.session.read('aid'))
            return {
              statusCode: 401,
              message: '请先登录',
            }
        },
      },
    })
    const handler = new Func({
      plugins: [http],
      async handler() {
        return 1
      },
    }).export().handler

    const res = await handler({
      httpMethod: 'POST',
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual('{"error":{"message":"请先登录"}}')
  })

  test('throw error', async () => {
    const http = new Http({
      validator: {
        async before() {
          throw Error('something going wrong')
        },
      },
    })
    const handler = new Func({
      plugins: [http],
      async handler() {
        return 1
      },
    }).export().handler

    const res = await handler({
      httpMethod: 'POST',
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual('{"error":{"message":"something going wrong"}}')
  })
})
