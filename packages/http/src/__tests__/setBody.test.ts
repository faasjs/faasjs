import { Func } from '@faasjs/func'
import { Http } from '..'

describe('setBody', () => {
  test('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setBody('body')
      },
    }).export().handler

    const res = await handler({})

    expect(res.body).toEqual('body')
  })
})
