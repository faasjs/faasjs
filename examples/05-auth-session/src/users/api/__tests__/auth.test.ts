import { Func, Knex, KnexSchema } from '@faasjs/core'
import { test } from '@faasjs/dev'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { func as changePasswordFunc } from '../change-password.func'
import { func as profileFunc } from '../profile.func'
import { func as signinFunc } from '../signin.func'
import { func as signoutFunc } from '../signout.func'
import { func as signupFunc } from '../signup.func'

async function mountKnex(knex: Knex): Promise<void> {
  const handler = new Func({
    plugins: [knex],
    async handler() {
      return null
    },
  }).export().handler

  await handler({})
}

function getCookieHeader(headers: Record<string, unknown>): string {
  const setCookie = (headers['Set-Cookie'] ?? headers['set-cookie']) as
    | string
    | string[]
    | undefined

  if (!setCookie) return ''

  if (Array.isArray(setCookie)) {
    return setCookie.map(item => item.split(';')[0]).join(';')
  }

  return setCookie.split(';')[0]
}

describe('users auth api', () => {
  const signupApi = test(signupFunc)
  const signinApi = test(signinFunc)
  const signoutApi = test(signoutFunc)
  const changePasswordApi = test(changePasswordFunc)
  const profileApi = test(profileFunc)

  let knex: Knex

  beforeAll(async () => {
    knex = new Knex({
      name: 'knex',
      config: {
        client: 'pglite',
        connection: './.pglite_test',
        migrations: {
          directory: './src/db/migrations',
          extension: 'ts',
        },
      },
    })

    await mountKnex(knex)

    const schema = new KnexSchema(knex)
    await schema.migrateLatest()
  })

  beforeEach(async () => {
    await knex.query('users').delete()
  })

  afterAll(async () => {
    await knex.quit()
  })

  it('signup writes session and profile reads current user', async () => {
    const signup = await signupApi.JSONhandler({
      username: 'alice',
      password: 'alice-password',
    })

    expect(signup.statusCode).toBe(200)
    expect(signup.data).toMatchObject({
      username: 'alice',
    })

    const profile = await profileApi.JSONhandler({}, { headers: { cookie: getCookieHeader(signup.headers) } })

    expect(profile.statusCode).toBe(200)
    expect(profile.data).toMatchObject({
      username: 'alice',
    })
  })

  it('changes password and signs in with new password', async () => {
    const signup = await signupApi.JSONhandler({
      username: 'bob',
      password: 'bob-password',
    })

    const changed = await changePasswordApi.JSONhandler(
      {
        oldPassword: 'bob-password',
        newPassword: 'bob-password-next',
      },
      {
        headers: {
          cookie: getCookieHeader(signup.headers),
        },
      },
    )

    expect(changed.statusCode).toBe(204)

    const oldSignin = await signinApi.JSONhandler({
      username: 'bob',
      password: 'bob-password',
    })

    expect(oldSignin.statusCode).toBe(500)

    const newSignin = await signinApi.JSONhandler({
      username: 'bob',
      password: 'bob-password-next',
    })

    expect(newSignin.statusCode).toBe(200)

    const signout = await signoutApi.JSONhandler(
      {},
      {
        headers: {
          cookie: getCookieHeader(newSignin.headers),
        },
      },
    )

    expect(signout.statusCode).toBe(204)

    const profileAfterSignout = await profileApi.JSONhandler(
      {},
      {
        headers: {
          cookie: getCookieHeader(signout.headers),
        },
      },
    )

    expect(profileAfterSignout.statusCode).toBe(500)
  })

  it('rejects duplicate usernames', async () => {
    await signupApi.JSONhandler({
      username: 'sam',
      password: 'sam-password',
    })

    const duplicate = await signupApi.JSONhandler({
      username: 'sam',
      password: 'another-password',
    })

    expect(duplicate.statusCode).toBe(500)
    expect(duplicate.error).toEqual({
      message: 'Username already exists',
    })
  })
})
