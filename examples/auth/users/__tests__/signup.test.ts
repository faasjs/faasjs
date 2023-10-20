import { useKnex } from '@faasjs/knex'
import { FuncWarper } from '@faasjs/test'

describe('signup', function () {
  const func = new FuncWarper(require.resolve('../signup.func'))

  test('should work', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world',
    })

    expect(res.statusCode).toEqual(201)

    const rows = await useKnex().raw('SELECT * FROM users')

    expect(rows.length).toEqual(1)
    expect(rows[0].username).toEqual('hello')
    expect(rows[0].password).toEqual('world')
  })

  test('dup username', async function () {
    await useKnex().raw(
      "INSERT INTO users (username,password) VALUES ('hello','world')"
    )

    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world',
    })

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual(
      '{"error":{"message":"INSERT INTO users (username,password) VALUES (\'hello\', \'world\') - SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"}}'
    )
  })
})
