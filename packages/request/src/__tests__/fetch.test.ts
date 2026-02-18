import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Writable } from 'node:stream'
import { describe, expect, it, vi } from 'vitest'
import { ResponseError, request } from '..'

describe('request(fetch)', () => {
  it('does not set timeout signal by default', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    await request('https://example.com')

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.signal).toBeUndefined()
  })

  it('sets timeout signal when timeout is provided', async () => {
    const signal = new AbortController().signal
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(signal)
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    await request('https://example.com', { timeout: 1234, headers: {} })

    expect(timeoutSpy).toHaveBeenCalledWith(1234)
    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.signal).toBe(signal)
  })

  it('sets basic authorization header from auth option', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    await request('https://example.com', {
      auth: 'foo:bar',
      headers: {},
    })

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as { [key: string]: string }).Authorization).toBe(
      'Basic Zm9vOmJhcg=='
    )
  })

  it('does not override existing authorization header', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('ok', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    await request('https://example.com', {
      auth: 'foo:bar',
      headers: {
        Authorization: 'Bearer token',
      },
    })

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as { [key: string]: string }).Authorization).toBe(
      'Bearer token'
    )
  })

  it('uses custom parser for json response body', async () => {
    const parse = vi.fn((body: string) => ({ parsed: body }))
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"ok":true}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )

    const response = await request('https://example.com', {
      headers: {},
      parse,
    })

    expect(parse).toHaveBeenCalledWith('{"ok":true}')
    expect(response.body).toEqual({ parsed: '{"ok":true}' })
  })

  it('throws ResponseError with request snapshot on non-success status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('failed', {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'content-type': 'text/plain' },
      })
    )

    try {
      await request('https://example.com/path?a=1', {
        method: 'POST',
        body: { a: 1 },
      })
      throw Error('should not reach here')
    } catch (error: any) {
      expect(error).toBeInstanceOf(ResponseError)
      expect(error).toMatchObject({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        body: 'failed',
        request: {
          host: 'example.com',
          path: '/path?a=1',
          method: 'POST',
          body: '{"a":1}',
        },
      })
    }
  })

  it('sends file with FormData and removes multipart headers', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'faasjs-request-'))
    const filePath = join(tempDir, 'upload.txt')
    writeFileSync(filePath, 'hello')

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"ok":true}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    )

    try {
      await request('https://example.com/upload', {
        file: filePath,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Content-Length': '123',
        },
      })

      const init = fetchMock.mock.calls[0][1] as RequestInit
      const headers = init.headers as { [key: string]: string }

      expect(headers['Content-Type']).toBeUndefined()
      expect(headers['Content-Length']).toBeUndefined()
      expect(init.body).toBeInstanceOf(FormData)
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('pipes body to downloadStream and disables default accept-encoding', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('stream-data', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    const chunks: Buffer[] = []
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        callback()
      },
    })

    const result = await request('https://example.com/download', {
      downloadStream: stream,
      headers: {},
    })

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect((init.headers as { [key: string]: string })['Accept-Encoding']).toBe(
      undefined
    )
    expect(result).toBeUndefined()
    expect(Buffer.concat(chunks).toString()).toBe('stream-data')
  })

  it('pipes body to downloadFile and disables default accept-encoding', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'faasjs-request-'))
    const filePath = join(tempDir, 'download.txt')

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('file-data', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    )

    try {
      const result = await request('https://example.com/download-file', {
        downloadFile: filePath,
        headers: {},
      })

      const init = fetchMock.mock.calls[0][1] as RequestInit
      expect(
        (init.headers as { [key: string]: string })['Accept-Encoding']
      ).toBeUndefined()
      expect(result).toBeUndefined()
      expect(readFileSync(filePath).toString()).toBe('file-data')
    } finally {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('converts abort errors to timeout errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      Object.assign(new Error('aborted'), { name: 'AbortError' })
    )

    await expect(
      request('https://example.com', {
        timeout: 1,
      })
    ).rejects.toThrow('Timeout https://example.com')
  })
})
