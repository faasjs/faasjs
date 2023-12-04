import { request } from '..'
import { readFileSync, createWriteStream } from 'fs'

describe('request', () => {
  test('200', async () => {
    const gzip = await request('https://faasjs.com/', {
      headers: { 'Accept-Encoding': 'gzip', 'user-agent': 'faasjs' },
    })

    expect(gzip.statusCode).toEqual(200)
    expect(gzip.headers['content-encoding']).toEqual('gzip')
    expect(gzip.body).toContain('<!DOCTYPE html>')

    const br = await request('https://faasjs.com/', {
      headers: { 'Accept-Encoding': 'br', 'user-agent': 'faasjs' },
    })

    expect(br.statusCode).toEqual(200)
    expect(br.headers['content-encoding']).toEqual('br')
    expect(br.body).toContain('<!DOCTYPE html>')

    const normal = await request('https://faasjs.com/', {
      headers: { 'user-agent': 'faasjs' },
    })

    expect(normal.statusCode).toEqual(200)
    expect(normal.headers['content-encoding']).toEqual('br')
    expect(normal.body).toContain('<!DOCTYPE html>')
  })

  test('404', async () => {
    expect(
      async () => await request('https://www.npmjs.com/package/404404')
    ).rejects.toThrow('Not Found')
  })

  describe('query', () => {
    test('without ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        query: { test: 1 },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.path).toEqual('/?test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('with ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com/?a=1', {
        query: { test: [1, 2] },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.path).toEqual('/?a=1&test=1%2C2')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('headers', () => {
    test('with value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        headers: { 'Content-Type': 'text/xml' },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.headers['Content-Type']).toEqual('text/xml')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('without value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        headers: { 'X-HEADER': null },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.headers['X-HEADER']).toBeUndefined()
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('body', () => {
    test('form', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.body).toEqual('test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    test('json', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        method: 'POST',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request.body).toEqual('{"test":1}')
      expect(res.body.Response.Error.Code).toEqual('InvalidParameter')
    })
  })

  it('downloadFile', async () => {
    const res = await request('https://cvm.tencentcloudapi.com', {
      downloadFile: `${__dirname}/downloadFile.tmp`,
    })

    expect(res).toBeUndefined()

    expect(
      JSON.parse(readFileSync(`${__dirname}/downloadFile.tmp`).toString())
    ).toMatchObject({
      Response: {
        Error: {
          Code: 'MissingParameter',
          Message: 'The request is missing a required parameter `Timestamp`.',
        },
      },
    })
  })

  it('downloadStream', async () => {
    const stream = createWriteStream(`${__dirname}/downloadStream.tmp`)
    const res = await request('https://cvm.tencentcloudapi.com', {
      downloadStream: stream,
    })

    expect(res).toBeUndefined()

    expect(
      JSON.parse(readFileSync(`${__dirname}/downloadStream.tmp`).toString())
    ).toMatchObject({
      Response: {
        Error: {
          Code: 'MissingParameter',
          Message: 'The request is missing a required parameter `Timestamp`.',
        },
      },
    })
  })
})
