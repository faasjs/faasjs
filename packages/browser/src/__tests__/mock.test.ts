import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FaasBrowserClient, Response, ResponseError, setMock } from '..'

describe('mock', () => {
  beforeEach(() => {
    setMock(null)

    window.fetch = vi.fn(
      () =>
        Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          text: () => Promise.resolve('{"data":{"default":"fetch"}}'),
        }) as unknown as Promise<Response>
    ) as any
  })

  describe('setMock with MockHandler', () => {
    it('should work when MockHandler returns ResponseProps', async () => {
      setMock(async () => ({
        status: 201,
        data: { name: 'FaasJS' },
        headers: { 'X-Custom': 'value' },
      }))

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(201)
      expect(response.data).toEqual({ name: 'FaasJS' })
      expect(response.headers['X-Custom']).toBe('value')
    })

    it('should work when MockHandler returns Response instance', async () => {
      const mockResponse = new Response({
        status: 200,
        data: { result: 'success' },
      })

      setMock(async () => mockResponse)

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(200)
      expect(response.data).toEqual({ result: 'success' })
      expect(response).toBe(mockResponse)
    })

    it('should return empty Response when MockHandler returns void', async () => {
      setMock(async () => {})

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(204)
      expect(response.data).toBeUndefined()
    })

    it('should reject ResponseError when MockHandler returns Error', async () => {
      const error = new Error('mock error')
      setMock(async () => error)

      const client = new FaasBrowserClient('/')

      await expect(client.action('test')).rejects.toThrow('mock error')
    })

    it('should work with async MockHandler', async () => {
      setMock(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return {
          status: 200,
          data: { async: true },
        }
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.data).toEqual({ async: true })
    })
  })

  describe('setMock with ResponseProps', () => {
    it('should work with basic ResponseProps object', async () => {
      setMock({
        data: { name: 'test' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(200)
      expect(response.data).toEqual({ name: 'test' })
    })

    it('should work with complete ResponseProps object', async () => {
      setMock({
        status: 202,
        data: { id: 123 },
        headers: { 'X-Custom-Header': 'custom-value' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(202)
      expect(response.data).toEqual({ id: 123 })
      expect(response.headers['X-Custom-Header']).toBe('custom-value')
    })
  })

  describe('setMock with Response instance', () => {
    it('should work with Response instance', async () => {
      const response = new Response({
        status: 200,
        data: { value: 42 },
        headers: { 'X-Response': 'yes' },
      })

      setMock(response)

      const client = new FaasBrowserClient('/')
      const mockResponse = await client.action('test')

      expect(mockResponse.status).toBe(200)
      expect(mockResponse.data).toEqual({ value: 42 })
      expect(mockResponse.headers['X-Response']).toBe('yes')
    })
  })

  describe('setMock parameters', () => {
    it('should receive correct action parameter', async () => {
      const handler = vi.fn(async (action: string) => ({
        data: { action: action },
      }))

      setMock(handler)

      const client = new FaasBrowserClient('/')
      await client.action('my-action')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        'my-action',
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should receive correct params parameter', async () => {
      const handler = vi.fn(async (action: string, params: any) => ({
        data: { params: params },
      }))

      setMock(handler)

      const client = new FaasBrowserClient('/')
      const params = { key1: 'value1', key2: 'value2' }
      await client.action('test', params as any)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        'test',
        params,
        expect.any(Object)
      )
    })

    it('should receive correct options parameter', async () => {
      const handler = vi.fn(
        async (action: string, params: any, options: any) => ({
          data: {
            headers: options.headers,
            method: options.method,
          } as any,
        })
      )

      setMock(handler)

      const client = new FaasBrowserClient('/')
      await client.action('test', {} as any, { headers: { 'X-Custom': 'test' } })

      expect(handler).toHaveBeenCalledTimes(1)
      const optionsArg = handler.mock.calls[0][2]

      expect(optionsArg.method).toBe('POST')
      expect(optionsArg.headers['Content-Type']).toBeUndefined()
      expect(optionsArg.headers['X-Custom']).toBe('test')
      expect(optionsArg.body).toBe(JSON.stringify({}))
    })

    it('should receive X-FaasJS-Request-Id header in options', async () => {
      const handler = vi.fn(async (action: string, params: any, options: any) => ({
        data: { requestId: options.headers['X-FaasJS-Request-Id'] } as any,
      }))

      setMock(handler)

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(handler).toHaveBeenCalledTimes(1)
      const optionsArg = handler.mock.calls[0][2]

      expect(optionsArg.headers['X-FaasJS-Request-Id']).toBeDefined()
      expect((response.data as any).requestId).toBeDefined()
      expect((response.data as any).requestId).toMatch(/^F-/)
    })
  })

  describe('setMock clearing', () => {
    it('should restore normal fetch after setMock(null)', async () => {
      setMock({
        data: { mocked: true },
      })

      const client = new FaasBrowserClient('/')
      const mockResponse = await client.action('test')

      expect(mockResponse.data).toEqual({ mocked: true })

      setMock(null)

      const normalResponse = await client.action('test')

      expect(normalResponse.data).toEqual({ default: 'fetch' })
    })

    it('should restore normal fetch after clearing mock with undefined', async () => {
      setMock({
        data: { mocked: true },
      })

      const client = new FaasBrowserClient('/')
      const mockResponse = await client.action('test')

      expect(mockResponse.data).toEqual({ mocked: true })

      setMock(undefined as any)

      const normalResponse = await client.action('test')

      expect(normalResponse.data).toEqual({ default: 'fetch' })
    })
  })

  describe('advanced mock scenarios', () => {
    it('should return different data based on action', async () => {
      setMock(async (action: string) => {
        if (action === 'user') {
          return { data: { name: 'John' } }
        } else if (action === 'product') {
          return { data: { price: 100 } }
        }
        return { data: { default: true } }
      })

      const client = new FaasBrowserClient('/')

      const userResponse = await client.action('user')
      expect(userResponse.data).toEqual({ name: 'John' })

      const productResponse = await client.action('product')
      expect(productResponse.data).toEqual({ price: 100 })

      const defaultResponse = await client.action('other')
      expect(defaultResponse.data).toEqual({ default: true })
    })

    it('should return different data based on params', async () => {
      setMock(async (action: string, params: any) => {
        if (params?.type === 'premium') {
          return { data: { features: ['all'] } }
        } else {
          return { data: { features: ['basic'] } }
        }
      })

      const client = new FaasBrowserClient('/')

      const premiumResponse = await client.action('features', { type: 'premium' })
      expect(premiumResponse.data).toEqual({ features: ['all'] })

      const basicResponse = await client.action('features', { type: 'basic' })
      expect(basicResponse.data).toEqual({ features: ['basic'] })
    })

    it('should override mock when calling setMock multiple times', async () => {
      setMock({
        data: { version: 1 },
      })

      const client = new FaasBrowserClient('/')
      const response1 = await client.action('test')
      expect(response1.data).toEqual({ version: 1 })

      setMock({
        data: { version: 2 },
      })

      const response2 = await client.action('test')
      expect(response2.data).toEqual({ version: 2 })

      setMock(async () => ({
        data: { version: 3 },
      }))

      const response3 = await client.action('test')
      expect(response3.data).toEqual({ version: 3 })
    })

    it('should interact with beforeRequest', async () => {
      const handler = vi.fn(async (action: string, params: any, options: any) => ({
        data: {
          modifiedHeader: options.headers['X-Modified'],
        } as any,
      }))

      setMock(handler)

      const client = new FaasBrowserClient('/', {
        beforeRequest: async ({ headers }) => {
          headers['X-Modified'] = 'yes'
        },
      })

      const response = await client.action('test')

      expect(handler).toHaveBeenCalled()
      const optionsArg = handler.mock.calls[0][2]
      expect(optionsArg.headers['X-Modified']).toBe('yes')
      expect((response.data as any).modifiedHeader).toBe('yes')
    })

    it('should handle ResponseError from MockHandler', async () => {
      setMock(async () => {
        throw new ResponseError('Not Found', { status: 404 })
      })

      const client = new FaasBrowserClient('/')

      await expect(client.action('test')).rejects.toThrow('Not Found')
      await expect(client.action('test')).rejects.toMatchObject({
        status: 404,
      })
    })

    it('should handle plain Error from MockHandler', async () => {
      setMock(async () => {
        throw new Error('Internal Server Error')
      })

      const client = new FaasBrowserClient('/')

      await expect(client.action('test')).rejects.toThrow('Internal Server Error')
    })

    it('should work with empty ResponseProps', async () => {
      setMock({})

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(204)
      expect(response.data).toBeUndefined()
    })

    it('should work with ResponseProps only containing body', async () => {
      setMock({
        body: { key: 'value' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ key: 'value' })
      expect(response.data).toBeUndefined()
    })

    it('should work with ResponseProps containing both body and data', async () => {
      setMock({
        body: '{"custom":"body"}',
        data: { custom: 'data' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.body).toBe('{"custom":"body"}')
      expect(response.data).toEqual({ custom: 'data' })
    })
  })

  describe('edge cases and error scenarios', () => {
    it('should work with ResponseProps containing only headers', async () => {
      setMock({
        headers: { 'X-Auth': 'token-123', 'X-Session': 'session-abc' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(204)
      expect(response.data).toBeUndefined()
      expect(response.headers['X-Auth']).toBe('token-123')
      expect(response.headers['X-Session']).toBe('session-abc')
    })

    it('should work with complex nested data structures', async () => {
      setMock({
        data: {
          user: {
            id: 1,
            name: 'John',
            profile: {
              age: 30,
              address: {
                city: 'New York',
                country: 'USA',
                coordinates: { lat: 40.7128, lng: -74.006 },
              },
            },
          },
          roles: ['admin', 'user'],
          permissions: { read: true, write: true, delete: false },
        },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.data).toEqual({
        user: {
          id: 1,
          name: 'John',
          profile: {
            age: 30,
            address: {
              city: 'New York',
              country: 'USA',
              coordinates: { lat: 40.7128, lng: -74.006 },
            },
          },
        },
        roles: ['admin', 'user'],
        permissions: { read: true, write: true, delete: false },
      })
    })

    it('should work with various HTTP status codes', async () => {
      const statusCodes = [200, 201, 202, 204, 301, 400, 401, 403, 404, 500, 503]

      for (const status of statusCodes) {
        setMock({
          status,
          data: { status },
        })

        const client = new FaasBrowserClient('/')
        const response = await client.action('test')

        expect(response.status).toBe(status)
        expect(response.data).toEqual({ status })
      }
    })

    it('should handle MockHandler returning null', async () => {
      setMock(async () => null as any)

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(204)
      expect(response.data).toBeUndefined()
    })

    it('should handle MockHandler returning undefined', async () => {
      setMock(async () => undefined as any)

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.status).toBe(204)
      expect(response.data).toBeUndefined()
    })

    it('should work with multiple FaasBrowserClient instances', async () => {
      setMock({
        data: { global: 'mock' },
      })

      const client1 = new FaasBrowserClient('http://api1.com/')
      const client2 = new FaasBrowserClient('http://api2.com/')
      const client3 = new FaasBrowserClient('http://api3.com/')

      const response1 = await client1.action('test')
      const response2 = await client2.action('test')
      const response3 = await client3.action('test')

      expect(response1.data).toEqual({ global: 'mock' })
      expect(response2.data).toEqual({ global: 'mock' })
      expect(response3.data).toEqual({ global: 'mock' })
    })

    it('should not use custom request function when mock is set', async () => {
      const customRequest = vi.fn().mockResolvedValue(
        new Response({
          status: 200,
          data: { from: 'custom' },
        })
      )

      const client = new FaasBrowserClient('/', {
        request: customRequest,
      })

      setMock({
        data: { from: 'mock' },
      })

      const response = await client.action('test')

      expect(response.data).toEqual({ from: 'mock' })
      expect(customRequest).not.toHaveBeenCalled()
    })

    it('should handle headers with special characters', async () => {
      setMock({
        headers: {
          'X-Special': '!@#$%^&*()_+-={}[]|\\:";\'<>?,./~`',
          'X-Unicode': '你好世界🌍🎉',
          'X-Long-Value': 'a'.repeat(1000),
        },
        data: { test: 'value' },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.headers['X-Special']).toBe('!@#$%^&*()_+-={}[]|\\:";\'<>?,./~`')
      expect(response.headers['X-Unicode']).toBe('你好世界🌍🎉')
      expect(response.headers['X-Long-Value']).toBe('a'.repeat(1000))
    })

    it('should handle empty params object', async () => {
      const handler = vi.fn(async () => ({
        data: { received: true },
      }))

      setMock(handler)

      const client = new FaasBrowserClient('/')
      await client.action('test', {} as any)

      expect(handler).toHaveBeenCalledWith(
        'test',
        {},
        expect.any(Object)
      )
    })

    it('should handle ResponseError with full props', async () => {
      setMock(async () => {
        throw new ResponseError('Custom error', {
          status: 418,
          headers: { 'X-Custom': 'value' },
          body: { custom: 'body' },
        })
      })

      const client = new FaasBrowserClient('/')

      try {
        await client.action('test')
        throw new Error('Should have thrown')
      } catch (error: any) {
        expect(error).toBeInstanceOf(ResponseError)
        expect(error.message).toBe('Custom error')
        expect(error.status).toBe(418)
        expect(error.headers['X-Custom']).toBe('value')
        expect(error.body).toEqual({ custom: 'body' })
      }
    })

    it('should handle array data in ResponseProps', async () => {
      setMock({
        data: [1, 2, 3, 4, 5],
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.data).toEqual([1, 2, 3, 4, 5])
    })

    it('should handle null and undefined values in data', async () => {
      setMock({
        data: {
          nullValue: null,
          undefinedValue: undefined,
          emptyString: '',
          zero: 0,
          falseValue: false,
        },
      })

      const client = new FaasBrowserClient('/')
      const response = await client.action('test')

      expect(response.data).toEqual({
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        zero: 0,
        falseValue: false,
      })
    })
  })
})
