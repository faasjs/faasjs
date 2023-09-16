import { Provider } from '../..'
import { setMock } from '@faasjs/request'

describe('invoke', function () {
  test('success', async function () {
    setMock(async function () {
      return await Promise.resolve({
        headers: {},
        body: { Response: { Result: { RetMsg: 'done' } } },
      })
    })

    const tc = new Provider({
      secretId: 'secretId',
      secretKey: 'secretKey',
    })

    await expect(
      tc.invokeSyncCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {},
      })
    ).resolves.toEqual('done')
  })

  test('fail', async function () {
    setMock(async function () {
      return await Promise.resolve({
        headers: {},
        body: { Response: { Result: { ErrMsg: 'ErrMsg' } } },
      })
    })

    const tc = new Provider({
      secretId: 'secretId',
      secretKey: 'secretKey',
    })

    await expect(
      tc.invokeSyncCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {},
      })
    ).rejects.toEqual(Error('ErrMsg'))
  })
})
