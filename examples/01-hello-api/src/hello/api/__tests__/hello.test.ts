import { test } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { func } from '../hello.func'

describe('hello/api/hello', () => {
  it('returns hello message with default name', async () => {
    const wrapped = test(func)

    const response = await wrapped.JSONhandler({})

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      message: 'Hello, FaasJS!',
    })
  })

  it('returns hello message with custom name', async () => {
    const wrapped = test(func)

    const response = await wrapped.JSONhandler({ name: 'world' })

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      message: 'Hello, world!',
    })
  })
})
