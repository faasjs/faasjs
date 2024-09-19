import { test } from '@faasjs/test'

describe('signout', function () {
  const func = test(__dirname + '/../signout.func')

  beforeEach(async () => await func.mount())

  it('should work', async function () {
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
