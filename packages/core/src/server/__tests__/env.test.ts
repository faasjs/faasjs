import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { closeAll, Server } from '../../server'

describe('server env loading', () => {
  const temporaryRoots: string[] = []
  const key = 'FAASJS_SERVER_DOTENV'
  const keepKey = 'FAASJS_SERVER_DOTENV_KEEP'
  const originalKey = process.env[key]
  const originalKeepKey = process.env[keepKey]

  afterEach(async () => {
    vi.restoreAllMocks()

    if (typeof originalKey === 'undefined') delete process.env[key]
    else process.env[key] = originalKey

    if (typeof originalKeepKey === 'undefined') delete process.env[keepKey]
    else process.env[keepKey] = originalKeepKey

    for (const root of temporaryRoots.splice(0)) {
      rmSync(root, {
        recursive: true,
        force: true,
      })
    }

    await closeAll()
  })

  it('should load .env from process cwd on server initialization', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-server-env-'))
    temporaryRoots.push(root)

    writeFileSync(join(root, '.env'), `${key}=from-env\n`)
    delete process.env[key]

    vi.spyOn(process, 'cwd').mockReturnValue(root)

    new Server(join(__dirname, 'funcs'))

    expect(process.env[key]).toBe('from-env')
  })

  it('should keep existing process env values', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-server-env-'))
    temporaryRoots.push(root)

    writeFileSync(join(root, '.env'), `${keepKey}=from-env\n`)
    process.env[keepKey] = 'from-process'

    vi.spyOn(process, 'cwd').mockReturnValue(root)

    new Server(join(__dirname, 'funcs'))

    expect(process.env[keepKey]).toBe('from-process')
  })
})
