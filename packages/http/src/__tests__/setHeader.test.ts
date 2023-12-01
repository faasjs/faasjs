import { Func } from '@faasjs/func'
import { Http } from '..'

describe('setHeader', () => {
  test('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setHeader('key', 'value')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(201)
    expect(res.headers.key).toEqual('value')
  })
})
