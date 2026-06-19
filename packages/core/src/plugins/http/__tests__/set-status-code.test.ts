import { describe, expect, it } from 'vitest'

import { createHttpHandler } from './helpers'

describe('setStatusCode', () => {
  it('should work', async () => {
    const handler = createHttpHandler(({ setStatusCode }) => {
      setStatusCode(404)
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(404)
  })
})
