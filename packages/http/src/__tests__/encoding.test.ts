import { Func } from '@faasjs/func'
import {
  brotliCompressSync, deflateSync, gzipSync
} from 'zlib'
import { Http } from '..'

describe('Accept-Encoding', function () {
  beforeAll(function () {
    process.env.FaasMode = 'remote'
  })

  afterAll(function () {
    process.env.FaasMode = 'local'
  })

  const data = new Array(201).join('1')

  test('br', async function () {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler () {
        return data
      }
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'br' },
      body: null
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('br')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(brotliCompressSync(`{"data":"${data}"}`).toString('base64'))
  })

  test('gzip', async function () {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler () {
        return data
      }
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'gzip' },
      body: null
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('gzip')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(gzipSync(`{"data":"${data}"}`).toString('base64'))
  })

  test('deflate', async function () {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler () {
        return data
      }
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'deflate' },
      body: null
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('deflate')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(deflateSync(`{"data":"${data}"}`).toString('base64'))
  })

  test('unknown', async function () {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler () {
        return data
      }
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'unknown' },
      body: null
    })

    expect(res.body).toEqual(`{"data":"${data}"}`)
  })
})
