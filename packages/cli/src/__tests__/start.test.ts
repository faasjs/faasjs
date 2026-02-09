import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { action } from '../commands/start'

const mocks = vi.hoisted(() => {
  const listen = vi.fn()
  const calls: any[][] = []

  class ServerMock {
    constructor(...args: any[]) {
      calls.push(args)
    }

    listen() {
      listen()
    }
  }

  return {
    listen,
    calls,
    ServerMock,
    staticHandler: vi.fn(() => vi.fn(async () => {})),
  }
})

vi.mock('@faasjs/server', () => ({
  Server: mocks.ServerMock,
  staticHandler: mocks.staticHandler,
}))

describe('start command', () => {
  it('should create and listen server', () => {
    const rootPath = mkdtempSync(join(tmpdir(), 'faas-start-'))
    mkdirSync(join(rootPath, 'src'), { recursive: true })

    process.env.FaasRoot = rootPath

    action({ port: 3001, apiOnly: true })

    expect(mocks.calls).toHaveLength(1)
    expect(mocks.calls[0][0]).toBe(join(rootPath, 'src'))
    expect(mocks.calls[0][1].port).toBe(3001)
    expect(mocks.listen).toHaveBeenCalledTimes(1)

    rmSync(rootPath, { recursive: true, force: true })
  })
})
