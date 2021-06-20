import Tencentcloud from '../..'
import { setMock } from '@faasjs/request'

describe('invoke', function () {
  describe('basic', function () {
    test('async', async function () {
      const tc = new Tencentcloud({
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      })

      const res = await tc.invokeCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {}
      })

      expect(res).toBeUndefined()
    })

    test('sync', async function () {
      const tc = new Tencentcloud({
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      })

      const res = await tc.invokeSyncCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {}
      })

      expect(res).toBeNull()
    })
  })

  test('string', async function () {
    const tc = new Tencentcloud({
      secretId: 'secretId',
      secretKey: 'secretKey',
      region: 'region'
    })

    const res = await tc.invokeSyncCloudFunction('../__tests__/funcs/string', {
      event: {},
      context: {}
    })

    expect(res).toEqual('')
  })

  test('object', async function () {
    const tc = new Tencentcloud({
      secretId: 'secretId',
      secretKey: 'secretKey',
      region: 'region'
    })

    const res = await tc.invokeSyncCloudFunction('../__tests__/funcs/object', {
      event: {},
      context: {}
    })

    expect(res).toEqual({ Result: {} })
  })

  test('failed', async function () {
    const tc = new Tencentcloud({
      secretId: 'secretId',
      secretKey: 'secretKey',
      region: 'region'
    })

    try {
      await tc.invokeSyncCloudFunction('../__tests__/funcs/fail', {
        event: {},
        context: {}
      })
    } catch (error) {
      expect(error.message).toEqual('wrong')
    }
  })

  describe('mock network', function () {
    beforeAll(function () {
      delete process.env.FaasMode
      setMock(null)
    })

    afterAll(function () {
      process.env.FaasMode = 'local'
      setMock(null)
    })

    test('success', async function () {
      setMock(async function () {
        return await Promise.resolve({
          headers: {},
          body: { Response: { Result: {} } }
        })
      })

      const tc = new Tencentcloud({
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      })

      await expect(tc.invokeSyncCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {}
      })).resolves.toEqual({ Result: {} })
    })

    test('fail', async function () {
      setMock(async function () {
        return await Promise.resolve({
          headers: {},
          body: { Response: { Result: { ErrMsg: 'ErrMsg' } } }
        })
      })

      const tc = new Tencentcloud({
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      })

      await expect(tc.invokeSyncCloudFunction('../__tests__/funcs/basic', {
        event: {},
        context: {}
      })).rejects.toEqual(Error('ErrMsg'))
    })
  })
})
