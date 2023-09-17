import { FuncWarper } from '@faasjs/test'
import { useKnex } from '@faasjs/knex'

describe('change-password', function () {
  const func = new FuncWarper(require.resolve('../change-password.func'))

  beforeEach(async function () {
    await func.mount()
    await useKnex().raw(
      "INSERT INTO users (id,username,password) VALUES (1,'hello','world')"
    )
  })

  test('should work', async function () {
    const res = await func.JSONhandler(
      {
        old_password: 'world',
        new_password: 'hello',
      },
      {
        session: { user_id: 1 },
      }
    )

    expect(res.statusCode).toEqual(201)

    const row = await useKnex().raw(
      'SELECT password FROM users WHERE id = 1 LIMIT 1'
    )

    expect(row[0].password).toEqual('hello')
  })

  test('wrong password', async function () {
    const res = await func.JSONhandler(
      {
        old_password: 'hello',
        new_password: 'hello',
      },
      {
        session: { user_id: 1 },
      }
    )

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual('{"error":{"message":"旧密码错误"}}')

    const row = await useKnex().raw(
      'SELECT password FROM users WHERE id = 1 LIMIT 1'
    )

    expect(row[0].password).toEqual('world')
  })
})
