import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import api from '../hello.api'

describe('hello/api/hello', () => {
  const handler = testApi(api)

  it('returns hello message with default name', async () => {
    const response = await handler({})

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      message: 'Hello, FaasJS!',
    })
  })

  it('returns hello message with custom name', async () => {
    const response = await handler({ name: 'world' })

    expect(response.statusCode).toBe(200)
    expect(response.data).toEqual({
      message: 'Hello, world!',
    })
  })
})
