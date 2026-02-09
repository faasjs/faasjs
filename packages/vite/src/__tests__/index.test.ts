import { spawn } from 'node:child_process'
import { request } from 'node:http'
import { createServer } from 'vite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { viteFaasJsServer } from '../index'

vi.mock('node:child_process', () => ({
  spawn: vi.fn(),
}))

vi.mock('node:http', async () => ({
  request: vi.fn(),
}))

describe('viteFaasJsServer', () => {
  let mockChildProcess: any

  beforeEach(async () => {
    process.env.VITEST = ''
    mockChildProcess = {
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
      kill: vi.fn(),
    }
    vi.mocked(spawn).mockReturnValue(mockChildProcess)
    vi.mocked(request).mockImplementation((_url, _options, callback) => {
      callback({
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
        },
        pipe: vi.fn(res => {
          res.write(JSON.stringify({ success: true }))
          res.end()
          return res
        }),
      } as any)
      return {
        on: vi.fn(),
        end: vi.fn(),
        write: vi.fn(),
      } as any
    })
  })

  afterEach(() => {
    process.env.VITEST = '1'
    vi.clearAllMocks()
  })

  it('should resolve config with default options', async () => {
    await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    expect(spawn).toHaveBeenCalledWith(
      'npm exec faas start -- --api-only -p 3000 -r /test/root -v',
      { stdio: 'pipe', shell: true }
    )
  })

  it('should resolve config with custom options', async () => {
    await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [
        viteFaasJsServer({
          root: '/custom/root',
          base: '/custom/base',
          port: 4000,
        }),
      ],
    })

    expect(spawn).toHaveBeenCalledWith(
      'npm exec faas start -- --api-only -p 4000 -r /custom/root -v',
      {
        stdio: 'pipe',
        shell: true,
      }
    )
  })

  it('should resolve config with custom command', async () => {
    await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [
        viteFaasJsServer({
          root: '/custom/root',
          base: '/custom/base',
          port: 4000,
          command: 'custom-command',
        }),
      ],
    })

    expect(spawn).toHaveBeenCalledWith('custom-command', {
      stdio: 'pipe',
      shell: true,
    })
  })

  it('should work with request', async () => {
    const server = await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [viteFaasJsServer()],
    })

    await server.listen()

    expect(
      await fetch(
        `http://localhost:${server.config.server.port}/test/base/123`,
        { method: 'POST' }
      ).then(res => res.text())
    ).toBe(JSON.stringify({ success: true }))

    expect(request).toHaveBeenCalled()
  })
})
