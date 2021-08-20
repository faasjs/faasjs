import request from '../index'
import { readFileSync } from 'fs'

describe('request', function () {
  test('200', async () => {
    const res = await request('https://cdn.jsdelivr.net/npm/faasjs/LICENSE')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(readFileSync(process.cwd() + '/LICENSE').toString())
  })

  describe('query', function () {
    test('without ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', { query: { test: 1 } })

      expect(res.statusCode).toEqual(200)
      expect(res.request.path).toEqual('/?test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('with ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com/?a=1', { query: { test: [1, 2] } })

      expect(res.statusCode).toEqual(200)
      expect(res.request.path).toEqual('/?a=1&test=1%2C2')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('headers', function () {
    test('with value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', { headers: { 'X-HEADER': 'VALUE' } })

      expect(res.statusCode).toEqual(200)
      expect(res.request.headers['X-HEADER']).toEqual('VALUE')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('without value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', { headers: { 'X-HEADER': null } })

      expect(res.statusCode).toEqual(200)
      expect(res.request.headers['X-HEADER']).toBeUndefined()
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('body', function () {
    test('form', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST'
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.body).toEqual('test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('json', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        method: 'POST'
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.body).toEqual('{"test":1}')
      expect(res.body.Response.Error.Code).toEqual('InvalidParameter')
    })
  })
})
