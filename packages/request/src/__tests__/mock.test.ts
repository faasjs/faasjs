import { request, setMock } from '..'

describe('mock', () => {
  test('should work', async () => {
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
