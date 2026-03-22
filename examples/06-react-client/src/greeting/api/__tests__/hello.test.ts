import { test } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import { func } from '../hello.func'

describe('greeting/api/hello', () => {
  it('returns greeting message', async () => {
    const wrapped = test(func)

    const response = await wrapped.JSONhandler({
      name: 'React',
    })

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      message: 'Hello, React!',
    })
  })
})
