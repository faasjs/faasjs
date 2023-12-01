import { Func } from '@faasjs/func'
import { Http } from '..'

describe('setStatusCode', () => {
  test('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setStatusCode(404)
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(404)
  })
})
