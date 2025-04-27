import { spawn } from 'node:child_process'
import { createServer } from 'vite'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { viteFaasJsServer } from '../index'

vi.mock('node:child_process', () => ({
  spawn: vi.fn(),
}))

describe('viteFaasJsServer', () => {
  let mockChildProcess: any

  beforeEach(async () => {
    mockChildProcess = {
      stdout: { on: vi.fn() },
      stderr: { on: vi.fn() },
      kill: vi.fn(),
    }
    vi.mocked(spawn).mockReturnValue(mockChildProcess)
  })

  afterEach(() => {
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
      'npm exec faas dev -- -p 3000 -r /test/root/test/base/ -v',
      { stdio: 'pipe', shell: true }
    )
  })

  it('should resolve config with custom options', async () => {
    await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [viteFaasJsServer({
        root: '/custom/root',
        base: '/custom/base',
        port: 4000,
      })],
    })

    expect(spawn).toHaveBeenCalledWith('npm exec faas dev -- -p 4000 -r /custom/root/custom/base -v', {
      stdio: 'pipe',
      shell: true,
    })
  })

  it('should resolve config with custom command', async () => {
    await createServer({
      configFile: false,
      root: '/test/root',
      base: '/test/base',
      logLevel: 'silent',
      plugins: [viteFaasJsServer({
        root: '/custom/root',
        base: '/custom/base',
        port: 4000,
        command: 'custom-command',
      })],
    })

    expect(spawn).toHaveBeenCalledWith('custom-command', {
      stdio: 'pipe',
      shell: true,
    })
  })
})
