import { createWriteStream, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { request } from '..'

describe('request', () => {
  it('200', async () => {
    const gzip = await request('https://mock.httpstatus.io/200', {
      headers: { 'Accept-Encoding': 'gzip', 'user-agent': 'faasjs' },
    })

    expect(gzip.statusCode).toEqual(200)
    expect(gzip.headers['content-encoding']).toEqual('gzip')
    expect(gzip.body).toContain('200 OK')

    const br = await request('https://mock.httpstatus.io/200', {
      headers: { 'Accept-Encoding': 'br', 'user-agent': 'faasjs' },
    })

    expect(br.statusCode).toEqual(200)
    expect(br.headers['content-encoding']).toEqual('br')
    expect(br.body).toContain('200 OK')

    const normal = await request('https://mock.httpstatus.io/200', {
      headers: { 'user-agent': 'faasjs' },
    })

    expect(normal.statusCode).toEqual(200)
    expect(normal.headers['content-encoding']).toEqual('br')
    expect(normal.body).toContain('200 OK')
  })

  it('404', async () => {
    await expect(request('https://mock.httpstatus.io/404')).rejects.toThrow('Not Found')
  })

  describe('query', () => {
    it('without ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        query: { test: 1 },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.path).toEqual('/?test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    it('with ?', async () => {
      const res = await request('https://cvm.tencentcloudapi.com/?a=1', {
        query: { test: [1, 2] },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.path).toEqual('/?a=1&test=1%2C2')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('headers', () => {
    it('with value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        headers: { 'Content-Type': 'text/xml' },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.headers?.['Content-Type']).toEqual('text/xml')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    it('without value', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        headers: { 'X-HEADER': null as unknown as string },
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.headers?.['X-HEADER']).toBeUndefined()
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })
  })

  describe('body', () => {
    it('form', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.body).toEqual('test=1')
      expect(res.body.Response.Error.Code).toEqual('MissingParameter')
    })

    it('json', async () => {
      const res = await request('https://cvm.tencentcloudapi.com', {
        body: { test: 1 },
        method: 'POST',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.request?.body).toEqual('{"test":1}')
      expect(res.body.Response.Error.Code).toEqual('InvalidParameter')
    })
  })

  it('downloadFile', async () => {
    const res = await request('https://cvm.tencentcloudapi.com', {
      downloadFile: `${__dirname}/downloadFile.tmp`,
    })

    expect(res).toBeUndefined()

    expect(JSON.parse(readFileSync(`${__dirname}/downloadFile.tmp`).toString())).toMatchObject({
      Response: {
        Error: {
          Code: 'MissingParameter',
          Message: expect.stringContaining('required parameter `Timestamp`.'),
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

    expect(JSON.parse(readFileSync(`${__dirname}/downloadStream.tmp`).toString())).toMatchObject({
      Response: {
        Error: {
          Code: 'MissingParameter',
          Message: expect.stringContaining('required parameter `Timestamp`.'),
        },
      },
    })
  })
})
