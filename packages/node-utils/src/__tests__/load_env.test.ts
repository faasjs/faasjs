import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadEnvFileIfExists } from '../load_env'

describe('loadEnvFileIfExists', () => {
  const temporaryRoots: string[] = []
  const key = 'FAASJS_NODE_UTILS_DOTENV'
  const keepKey = 'FAASJS_NODE_UTILS_DOTENV_KEEP'
  const originalKey = process.env[key]
  const originalKeepKey = process.env[keepKey]

  afterEach(() => {
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
  })

  it('should load .env from process cwd', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-env-'))
    temporaryRoots.push(root)

    writeFileSync(join(root, '.env'), `${key}=from-env\n`)
    delete process.env[key]

    const cwd = vi.spyOn(process, 'cwd').mockReturnValue(root)
    const loaded = loadEnvFileIfExists()

    expect(cwd).toHaveBeenCalledTimes(1)
    expect(loaded).toBe(join(root, '.env'))
    expect(process.env[key]).toBe('from-env')
  })

  it('should skip when .env is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-env-'))
    temporaryRoots.push(root)

    delete process.env[key]

    expect(loadEnvFileIfExists({ cwd: root })).toBeNull()
    expect(process.env[key]).toBeUndefined()
  })

  it('should not override existing process env values', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-env-'))
    temporaryRoots.push(root)

    writeFileSync(join(root, '.env'), `${keepKey}=from-env\n`)
    process.env[keepKey] = 'from-process'

    loadEnvFileIfExists({ cwd: root })

    expect(process.env[keepKey]).toBe('from-process')
  })

  it('should throw when .env content cannot be read as file text', () => {
    const root = mkdtempSync(join(tmpdir(), 'faas-load-env-'))
    temporaryRoots.push(root)

    mkdirSync(join(root, '.env'))

    expect(() => loadEnvFileIfExists({ cwd: root })).toThrow()
  })
})
