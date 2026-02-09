import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { action } from '../commands/init'

describe('init command', () => {
  it('should initialize project files in target folder', () => {
    const rootPath = mkdtempSync(join(tmpdir(), 'faas-init-'))
    const targetPath = join(rootPath, 'app')

    action(targetPath, { force: false })

    expect(existsSync(join(targetPath, 'package.json'))).toBe(true)
    expect(existsSync(join(targetPath, 'src', 'faas.yaml'))).toBe(true)
    expect(
      existsSync(
        join(targetPath, 'src', 'pages', 'home', 'api', 'hello.func.ts')
      )
    ).toBe(true)

    rmSync(rootPath, { recursive: true, force: true })
  })

  it('should reject non-empty target directory by default', () => {
    const rootPath = mkdtempSync(join(tmpdir(), 'faas-init-non-empty-'))
    const targetPath = join(rootPath, 'app')
    mkdirSync(targetPath, { recursive: true })
    writeFileSync(join(targetPath, 'keep.txt'), 'keep')

    expect(() => action(targetPath, { force: false })).toThrow(
      /Directory is not empty/
    )

    rmSync(rootPath, { recursive: true, force: true })
  })

  it('should overwrite existing files with --force', () => {
    const rootPath = mkdtempSync(join(tmpdir(), 'faas-init-force-'))
    const targetPath = join(rootPath, 'app')
    mkdirSync(join(targetPath, 'src'), { recursive: true })
    writeFileSync(join(targetPath, 'package.json'), '{"name":"old"}\n')

    action(targetPath, { force: true })

    expect(readFileSync(join(targetPath, 'package.json')).toString()).toContain(
      '"name": "app"'
    )

    rmSync(rootPath, { recursive: true, force: true })
  })
})
