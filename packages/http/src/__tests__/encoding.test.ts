import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib'
import { Func } from '@faasjs/func'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Http } from '..'

describe('Accept-Encoding', () => {
  beforeAll(() => {
    process.env.FaasMode = 'remote'
  })

  afterAll(() => {
    process.env.FaasMode = 'local'
  })

  const data = new Array(1025).join('1')

  it('br', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return data
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'br' },
      body: null,
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('br')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(
      brotliCompressSync(`{"data":"${data}"}`).toString('base64')
    )
  })

  it('gzip', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return data
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'gzip' },
      body: null,
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('gzip')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(gzipSync(`{"data":"${data}"}`).toString('base64'))
  })

  it('deflate', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return data
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'deflate' },
      body: null,
    })

    expect(res.isBase64Encoded).toBeTruthy()
    expect(res.headers['Content-Encoding']).toEqual('deflate')
    expect(res.originBody).toEqual(`{"data":"${data}"}`)
    expect(res.body).toEqual(
      deflateSync(`{"data":"${data}"}`).toString('base64')
    )
  })

  it('unknown', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return data
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'unknown' },
      body: null,
    })

    expect(res.body).toEqual(`{"data":"${data}"}`)
  })
})
