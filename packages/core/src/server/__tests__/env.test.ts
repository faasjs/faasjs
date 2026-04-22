import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { closeAll, Server } from '../../server'

describe('server env loading', () => {
  const temporaryRoots: string[] = []
  const key = 'FAASJS_SERVER_DOTENV'
  const originalKey = process.env[key]

  afterEach(async () => {
    vi.restoreAllMocks()

    if (typeof originalKey === 'undefined') delete process.env[key]
    else process.env[key] = originalKey

    for (const root of temporaryRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }

    await closeAll()
  })

  it('should not load .env from process cwd on server initialization', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-server-env-'))
    temporaryRoots.push(root)

    writeFileSync(join(root, '.env'), `${key}=from-env\n`)
    delete process.env[key]

    vi.spyOn(process, 'cwd').mockReturnValue(root)

    new Server(join(__dirname, 'funcs'))

    expect(process.env[key]).toBeUndefined()
  })

  it('should load .env from the FaasJS project root when server root is src', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-server-env-'))
    temporaryRoots.push(root)

    mkdirSync(join(root, 'src'), {
      recursive: true,
    })
    writeFileSync(join(root, 'src', 'faas.yaml'), 'defaults:\n  plugins: {}\n')
    writeFileSync(join(root, '.env'), `${key}=from-project-root\n`)
    delete process.env[key]

    new Server(join(root, 'src'))

    expect(process.env[key]).toBe('from-project-root')
  })

  it('should warn instead of throwing when env file loading fails', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-server-env-'))
    temporaryRoots.push(root)

    mkdirSync(join(root, 'src'), {
      recursive: true,
    })
    writeFileSync(join(root, 'src', 'faas.yaml'), 'defaults:\n  plugins: {}\n')
    mkdirSync(join(root, '.env'))
    delete process.env[key]

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(() => new Server(join(root, 'src'))).not.toThrow()
    expect(warn).toHaveBeenCalledWith('[faasjs] Failed to load env file', expect.any(Error))
    expect(process.env[key]).toBeUndefined()
  })
})
