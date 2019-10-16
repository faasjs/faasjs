import request, { setMock } from '../index';

describe('mock', function () {
  test('should work', async function () {
    setMock(function (url, options) {
      return new Promise(function (resolve) {
        if (url === 'hello') {
          resolve({
            statusCode: 200,
            headers: {},
            body: 'world'
          })
        }
      })
    })

    const res = await request('hello');
    expect(res.body).toEqual('world');

    setMock(null);

    try {
      await request('hello');
    } catch (error) {
      expect(error.message).toEqual('Unkonw protocol');
    }
  })
})
