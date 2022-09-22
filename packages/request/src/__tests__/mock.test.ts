import { request, setMock } from '..'

describe('mock', function () {
  test('should work', async function () {
    setMock(async function () {
      return Promise.resolve({
        statusCode: 200,
        headers: {},
        body: 'world'
      })
    })

    const res = await request('hello')
    expect(res.body).toEqual('world')

    setMock(null)

    await expect(async () => request('/')).rejects.toMatchObject({
      code: 'ERR_INVALID_URL',
      input: '/'
    })
  })
})
