import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
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

vi.mock('../typegen', () => ({
  generateFaasTypes: vi.fn(async () => ({
    output: '/tmp/types.d.ts',
    changed: false,
    fileCount: 0,
    routeCount: 0,
  })),
  isTypegenSourceFile: vi.fn(
    (filePath: string) =>
      /\.func\.ts$/.test(filePath) || /(^|[\\/])faas\.ya?ml$/.test(filePath)
  ),
}))

const tempDirs: string[] = []

async function createTempProject(faasYaml?: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'faas-vite-'))
  tempDirs.push(root)

  await mkdir(join(root, 'src'), {
    recursive: true,
  })

  if (faasYaml)
    await writeFile(join(root, 'src', 'faas.yaml'), faasYaml, 'utf8')

  return root
}

describe('viteFaasJsServer', () => {
  beforeEach(() => {
    process.env.VITEST = ''
    mocks.calls.length = 0
    vi.clearAllMocks()
  })

  afterEach(async () => {
    process.env.VITEST = '1'
    vi.clearAllMocks()

    await Promise.all(
      tempDirs.splice(0).map(path =>
        rm(path, {
          recursive: true,
          force: true,
        })
      )
    )
  })

  it('should resolve config with default root', async () => {
    const root = await createTempProject()

    const server = await createServer({
      configFile: false,
      root,
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    expect(mocks.calls).toHaveLength(1)
    expect(mocks.calls[0][0]).toBe(join(root, 'src'))

    await server.close()
  })

  it('should use server base from faas.yaml', async () => {
    const root = await createTempProject(`defaults:
  server:
    base: /api
`)

    const server = await createServer({
      configFile: false,
      root,
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    await server.listen()

    const port = (server.httpServer?.address() as AddressInfo).port
    const response = await fetch(
      `http://localhost:${port}/api/home/api/hello?name=world`,
      {
        method: 'POST',
      }
    ).then(res => res.json())

    expect(response).toEqual({
      success: true,
      method: 'POST',
      url: '/home/api/hello?name=world',
    })

    await server.close()
  })

  it('should route post request to in-process server with vite base', async () => {
    const root = await createTempProject()

    const server = await createServer({
      configFile: false,
      root,
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
    const root = await createTempProject()

    const server = await createServer({
      configFile: false,
      root,
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
