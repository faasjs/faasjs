import { describe, expect, it } from 'vitest'
import { request, setMock } from '..'

describe('mock', () => {
  it('should work', async () => {
    setMock(async () =>
      Promise.resolve({
        statusCode: 200,
        headers: {},
        body: 'world',
      })
    )

    const res = await request('hello')
    expect(res.body).toEqual('world')

    setMock(null)

    await expect(async () => request('/')).rejects.toMatchObject({
      code: 'ERR_INVALID_URL',
      input: '/',
    })
  })
})
