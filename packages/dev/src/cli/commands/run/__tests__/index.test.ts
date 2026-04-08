import { EventEmitter } from 'node:events'
import { join, resolve } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { existsSyncMock, loadEnvFileIfExistsMock, realpathSyncMock, spawnMock } = vi.hoisted(() => ({
  existsSyncMock: vi.fn(),
  loadEnvFileIfExistsMock: vi.fn(),
  realpathSyncMock: vi.fn(),
  spawnMock: vi.fn(),
}))

vi.mock('node:child_process', () => ({
  spawn: spawnMock,
}))

vi.mock('node:fs', () => ({
  existsSync: existsSyncMock,
  realpathSync: realpathSyncMock,
}))

vi.mock('@faasjs/node-utils', () => ({
  loadEnvFileIfExists: loadEnvFileIfExistsMock,
}))

import { run } from '../index'

function queueChildClose(code: number | null, signal: NodeJS.Signals | null = null) {
  spawnMock.mockImplementationOnce(() => {
    const child = new EventEmitter() as EventEmitter & {
      once: EventEmitter['once']
    }

    setImmediate(() => {
      child.emit('close', code, signal)
    })

    return child
  })
}

describe('faas run command coverage', () => {
  const originalArgv1 = process.argv[1]

  beforeEach(() => {
    spawnMock.mockReset()
    existsSyncMock.mockReset()
    realpathSyncMock.mockReset()
    loadEnvFileIfExistsMock.mockReset()
    process.argv[1] = '/mock/bin/faas.mjs'
  })

  afterEach(() => {
    process.argv[1] = originalArgv1
    vi.restoreAllMocks()
  })

  it('should print help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    await expect(run(['--help'])).resolves.toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Run a TypeScript file'))
  })

  it('should print version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    await expect(run(['--version'])).resolves.toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^\d+\.\d+|^v?\d+/))
  })

  it('should throw when the file name is missing', async () => {
    await expect(run([])).rejects.toThrow('[faas run] Missing file name')
  })

  it('should fall back to the cwd register hooks file when argv[1] cannot be resolved', async () => {
    const cwdCandidate = join(process.cwd(), 'packages', 'node-utils', 'dist', 'register_hooks.mjs')

    realpathSyncMock.mockImplementation(() => {
      throw Error('bad symlink')
    })
    existsSyncMock.mockImplementation((path: string) => path === cwdCandidate)
    queueChildClose(0)

    const code = await run(['runner.ts', '--flag'])

    expect(code).toBe(0)
    expect(loadEnvFileIfExistsMock).toHaveBeenCalledWith({ cwd: process.cwd() })
    expect(spawnMock).toHaveBeenCalledWith(
      process.execPath,
      [
        '--import',
        expect.stringMatching(/^file:.*register_hooks\.mjs$/),
        resolve(process.cwd(), 'runner.ts'),
        '--flag',
      ],
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit',
      },
    )
  })

  it('should return code 1 when the child closes with a signal', async () => {
    const argvCandidate = join('/mock/bin', '../node-utils/dist/register_hooks.mjs')

    realpathSyncMock.mockReturnValue('/mock/bin/faas.mjs')
    existsSyncMock.mockImplementation((path: string) => path === argvCandidate)
    queueChildClose(null, 'SIGTERM')

    const code = await run(['--root', '/tmp/project', 'runner.ts'])

    expect(code).toBe(1)
    expect(loadEnvFileIfExistsMock).toHaveBeenCalledWith({ cwd: '/tmp/project' })
    expect(spawnMock).toHaveBeenCalledWith(
      process.execPath,
      ['--import', expect.stringMatching(/^file:.*register_hooks\.mjs$/), '/tmp/project/runner.ts'],
      {
        cwd: '/tmp/project',
        env: process.env,
        stdio: 'inherit',
      },
    )
  })

  it('should return code 0 when the child closes without code or signal', async () => {
    const cwdCandidate = join(process.cwd(), 'packages', 'node-utils', 'dist', 'register_hooks.mjs')

    process.argv[1] = undefined as unknown as string
    existsSyncMock.mockImplementation((path: string) => path === cwdCandidate)
    queueChildClose(null, null)

    await expect(run(['runner.ts'])).resolves.toBe(0)
  })

  it('should fail when no register hooks file can be resolved', async () => {
    realpathSyncMock.mockImplementation(() => {
      throw Error('missing binary')
    })
    existsSyncMock.mockReturnValue(false)

    await expect(run(['runner.ts'])).rejects.toThrow(
      '[faas run] Cannot resolve @faasjs/node-utils/register-hooks',
    )
  })
})
