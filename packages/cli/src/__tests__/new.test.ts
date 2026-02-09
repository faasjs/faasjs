import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { action as newApi } from '../commands/new/api'
import { action as newFeature } from '../commands/new/feature'
import { action as newPage } from '../commands/new/page'

describe('new commands', () => {
  it('should generate page, api and feature files', () => {
    const rootPath = mkdtempSync(join(tmpdir(), 'faas-new-'))
    process.env.FaasRoot = rootPath

    newPage('dashboard')
    newApi('dashboard/list')
    newFeature('dashboard/report-center')

    expect(existsSync(join(rootPath, 'src/pages/dashboard/index.tsx'))).toBe(
      true
    )
    expect(
      existsSync(join(rootPath, 'src/pages/dashboard/api/list.func.ts'))
    ).toBe(true)
    expect(
      existsSync(
        join(rootPath, 'src/pages/dashboard/report-center/components/index.tsx')
      )
    ).toBe(true)

    expect(
      readFileSync(
        join(rootPath, 'src/pages/dashboard/api/list.func.ts')
      ).toString()
    ).toContain("declare module '@faasjs/types'")

    rmSync(rootPath, { recursive: true, force: true })
  })
})
