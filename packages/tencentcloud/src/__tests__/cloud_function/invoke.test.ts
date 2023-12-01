import { Provider } from '../..'
import { setMock } from '@faasjs/request'

describe('invoke', () => {
  test('success', async () => {
    setMock(
      async () =>
        await Promise.resolve({
          headers: {},
          body: { Response: { Result: { RetMsg: 'done' } } },
        })
    )

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

  test('fail', async () => {
    setMock(
      async () =>
        await Promise.resolve({
          headers: {},
          body: { Response: { Result: { ErrMsg: 'ErrMsg' } } },
        })
    )

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
