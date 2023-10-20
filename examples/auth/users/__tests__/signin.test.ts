import { useKnex } from '@faasjs/knex'
import { FuncWarper } from '@faasjs/test'

describe('signin', function () {
  const func = new FuncWarper(require.resolve('../signin.func'))

  beforeEach(async function () {
    await useKnex().raw(
      "INSERT INTO users (id,username,password) VALUES (1,'hello','world')"
    )
  })

  test('should work', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world',
    })

    expect(
      func.http.session.decode(
        res.headers['Set-Cookie'][0].match(/key=([^;]+)/)[1]
      )
    ).toEqual({ user_id: 1 })
    expect(res.statusCode).toEqual(201)
  })

  test('wrong username', async function () {
    const res = await func.JSONhandler({
      username: '',
      password: '',
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual('{"error":{"message":"用户名错误"}}')
  })

  test('wrong password', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: '',
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual('{"error":{"message":"用户名或密码错误"}}')
  })
})
