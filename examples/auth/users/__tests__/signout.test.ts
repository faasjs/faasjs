import { FuncWarper } from '@faasjs/test'

describe('signout', function () {
  const func = new FuncWarper(require.resolve('../signout.func'))

  test('should work', async function () {
    const res = await func.handler({
      headers: {
        cookie: `key=${func.http.session.encode({ user_id: 1 })}`,
      },
    })

    expect(
      func.http.session.decode(
        res.headers['Set-Cookie'][0].match(/key=([^;]+)/)[1]
      )
    ).toEqual({})
    expect(res.statusCode).toEqual(201)
  })
})
