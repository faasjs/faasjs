import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const serverCalls: any[][] = []
  const generateFaasTypes = vi.fn(async () => ({
    output: '/tmp/types.d.ts',
    changed: true,
    fileCount: 1,
    routeCount: 1,
  }))
  const isTypegenSourceFile = vi.fn(
    (filePath: string) =>
      /\.func\.ts$/.test(filePath) || /(^|[\\/])faas\.ya?ml$/.test(filePath)
  )

  class ServerMock {
    constructor(...args: any[]) {
      serverCalls.push(args)
    }

    handle = vi.fn()
  }

  return {
    serverCalls,
    generateFaasTypes,
    isTypegenSourceFile,
    ServerMock,
  }
})

vi.mock('@faasjs/server', () => ({
  Server: mocks.ServerMock,
}))

vi.mock('../typegen', () => ({
  generateFaasTypes: mocks.generateFaasTypes,
  isTypegenSourceFile: mocks.isTypegenSourceFile,
}))

import { viteFaasJsServer } from '../vite'

const tempDirs: string[] = []

async function createTempProject(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'faas-vite-typegen-'))
  tempDirs.push(root)

  await mkdir(join(root, 'src'), {
    recursive: true,
  })

  return root
}

async function wait(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

beforeEach(() => {
  process.env.VITEST = ''
  mocks.serverCalls.length = 0
  vi.clearAllMocks()
})

afterEach(async () => {
  process.env.VITEST = '1'

  await Promise.all(
    tempDirs.splice(0).map(path =>
      rm(path, {
        recursive: true,
        force: true,
      })
    )
  )
})

describe('viteFaasJsServer typegen', () => {
  it('should run typegen once on startup', async () => {
    const root = await createTempProject()

    const server = await createServer({
      configFile: false,
      root,
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    expect(mocks.generateFaasTypes).toHaveBeenCalledTimes(1)
    expect(mocks.generateFaasTypes).toHaveBeenCalledWith({
      root,
    })

    await server.close()
  })

  it('should debounce watch events for typegen source files', async () => {
    const root = await createTempProject()

    const server = await createServer({
      configFile: false,
      root,
      base: '/test/base/',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    expect(mocks.generateFaasTypes).toHaveBeenCalledTimes(1)

    server.watcher.emit('all', 'change', join(root, 'src', 'a.func.ts'))
    server.watcher.emit('all', 'change', join(root, 'src', 'b.func.ts'))
    server.watcher.emit('all', 'change', join(root, 'src', 'faas.yaml'))
    server.watcher.emit('all', 'change', join(root, 'src', 'ignore.ts'))

    await wait(220)

    expect(mocks.generateFaasTypes).toHaveBeenCalledTimes(2)
    expect(mocks.isTypegenSourceFile).toHaveBeenCalledWith(
      join(root, 'src', 'ignore.ts')
    )

    await server.close()
  })
})
