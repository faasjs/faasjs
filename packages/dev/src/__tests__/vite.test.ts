import type { AddressInfo } from 'node:net'
import { join } from 'node:path'
import { createServer } from 'vite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { viteFaasJsServer } from '../vite'

const mocks = vi.hoisted(() => {
  const calls: any[][] = []
  const handle = vi.fn(async (req: any, res: any, _options?: any) => {
    res.statusCode = 200
    res.setHeader('content-type', 'application/json')
    res.end(
      JSON.stringify({
        success: true,
        method: req.method,
        url: req.url,
      })
    )
  })

  class ServerMock {
    constructor(...args: any[]) {
      calls.push(args)
    }

    handle = handle
  }

  return {
    calls,
    handle,
    ServerMock,
  }
})

vi.mock('@faasjs/server', () => ({
  Server: mocks.ServerMock,
}))

describe('viteFaasJsServer', () => {
  beforeEach(() => {
    process.env.VITEST = ''
    mocks.calls.length = 0
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env.VITEST = '1'
    vi.clearAllMocks()
  })

  it('should resolve config with default options', async () => {
    const server = await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    expect(mocks.calls).toHaveLength(1)
    expect(mocks.calls[0][0]).toBe(join('/test/root', 'src'))

    await server.close()
  })

  it('should resolve config with custom root and ignore removed options', async () => {
    const server = await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [
        viteFaasJsServer({
          root: '/custom/root',
          base: '/custom/base/',
          port: 4000,
          command: 'ignored',
        }),
      ],
    })

    expect(mocks.calls).toHaveLength(1)
    expect(mocks.calls[0][0]).toBe(join('/custom/root', 'src'))

    await server.close()
  })

  it('should route post request to in-process server with stripped base', async () => {
    const server = await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    await server.listen()

    const port = (server.httpServer?.address() as AddressInfo).port
    const response = await fetch(
      `http://localhost:${port}/test/base/home/api/hello?name=world`,
      {
        method: 'POST',
      }
    ).then(res => res.json())

    expect(response).toEqual({
      success: true,
      method: 'POST',
      url: '/home/api/hello?name=world',
    })

    expect(mocks.handle).toHaveBeenCalledTimes(1)
    expect(mocks.handle.mock.calls[0][2]).toEqual({
      requestedAt: expect.any(Number),
    })

    await server.close()
  })

  it('should skip non-post request', async () => {
    const server = await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    await server.listen()

    const port = (server.httpServer?.address() as AddressInfo).port
    await fetch(`http://localhost:${port}/test/base/home/api/hello`, {
      method: 'GET',
    })

    expect(mocks.handle).not.toHaveBeenCalled()

    await server.close()
  })
})
