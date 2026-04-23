import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { action } from '../action'

let execs: string[] = []

vi.mock('node:child_process', () => ({
  execSync(cmd: string) {
    execs.push(cmd)
  },
}))

const adminFiles = [
  '.env.example',
  '.gitignore',
  'index.html',
  'migrations/20250101000000_create_users.ts',
  'package.json',
  'server.ts',
  'src/faas.yaml',
  'src/main.tsx',
  'src/pages/home/api/auth/__tests__/me.test.ts',
  'src/pages/home/api/auth/me.api.ts',
  'src/pages/home/api/users/__tests__/create.test.ts',
  'src/pages/home/api/users/create.api.ts',
  'src/pages/home/index.tsx',
  'src/plugins/auth.ts',
  'src/types/faasjs-auth.d.ts',
  'src/types/faasjs-pg.d.ts',
  'tsconfig.json',
  'vite.config.ts',
]

const minimalFiles = [
  '.gitignore',
  'index.html',
  'package.json',
  'server.ts',
  'src/faas.yaml',
  'src/main.tsx',
  'src/pages/home/api/__tests__/hello.test.ts',
  'src/pages/home/api/hello.api.ts',
  'src/pages/home/index.tsx',
  'src/react-client.ts',
  'tsconfig.json',
  'vite.config.ts',
]

function listFiles(rootPath: string): string[] {
  const files: string[] = []

  function walk(currentPath: string): void {
    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const nextPath = join(currentPath, entry.name)

      if (entry.isDirectory()) {
        walk(nextPath)
        continue
      }

      files.push(relative(rootPath, nextPath))
    }
  }

  walk(rootPath)

  return files.sort()
}

function read(rootPath: string, path: string): string {
  return readFileSync(join(rootPath, path), 'utf8')
}

function expectGeneratedSessionSecret(content: string): void {
  expect(content).toMatch(/secret: '?[a-f0-9]{64}'?/)
  expect(content).not.toContain('secret: secret')
  expect(content).not.toContain('{{secret}}')
}

describe('action', () => {
  let currentDir = ''
  let tempDir = ''

  beforeEach(() => {
    execs = []
    currentDir = process.cwd()
    tempDir = mkdtempSync(join(tmpdir(), 'create-faas-app-'))
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(currentDir)
    rmSync(tempDir, {
      recursive: true,
      force: true,
    })
  })

  it('should create the admin template by default', async () => {
    await action({
      name: 'admin-app',
    })

    const rootPath = join(tempDir, 'admin-app')
    const packageJSON = JSON.parse(read(rootPath, 'package.json'))

    expect(execs).toEqual(['cd admin-app && npm install', 'cd admin-app && npm run test'])
    expect(listFiles(rootPath)).toEqual(adminFiles)
    expect(packageJSON.name).toBe('admin-app')
    expect(read(rootPath, 'package.json')).not.toContain('{{name}}')
    expectGeneratedSessionSecret(read(rootPath, 'src/faas.yaml'))
    expect(read(rootPath, 'server.ts')).toContain("import { loadEnvFile } from 'node:process'")
    expect(read(rootPath, 'server.ts')).toContain('try {')
    expect(read(rootPath, 'server.ts')).toContain('loadEnvFile()')
    expect(read(rootPath, 'server.ts')).toContain(
      "console.warn('[faasjs] Failed to load env file', error)",
    )
    expect(read(rootPath, '.env.example')).toContain('DATABASE_URL=postgres://')
    expect(read(rootPath, 'migrations/20250101000000_create_users.ts')).toContain(
      "builder.createTable('users'",
    )
    expect(read(rootPath, 'src/pages/home/api/users/create.api.ts')).toContain(
      "import { getClient } from '@faasjs/pg'",
    )
    expect(read(rootPath, 'src/pages/home/api/users/__tests__/create.test.ts')).toContain(
      "import { getClient } from '@faasjs/pg'",
    )
    expect(read(rootPath, 'src/pages/home/api/auth/me.api.ts')).toContain(
      'api.plugins.unshift(new AuthPlugin())',
    )
    expect(read(rootPath, 'src/pages/home/api/auth/__tests__/me.test.ts')).toContain(
      "authorization: 'Bearer demo-admin'",
    )
    expect(read(rootPath, 'src/plugins/auth.ts')).toContain('class AuthPlugin')
    expect(read(rootPath, 'src/types/faasjs-auth.d.ts')).toContain('interface DefineApiInject')
    expect(read(rootPath, 'src/types/faasjs-pg.d.ts')).toContain("import '@faasjs/pg'")
    expect(read(rootPath, 'src/types/faasjs-pg.d.ts')).toContain('interface Tables')
    expect(read(rootPath, 'vite.config.ts')).toContain(
      "import { TypedPgVitestPlugin } from '@faasjs/pg-dev'",
    )
    expect(read(rootPath, 'src/main.tsx')).toContain("import { App } from '@faasjs/ant-design'")
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain(
      "import { faas, useApp } from '@faasjs/ant-design'",
    )
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain('Call auth plugin demo')
    expect(listFiles(rootPath)).not.toContain('src/react-client.ts')
  })

  it('should create the minimal template when requested', async () => {
    await action({
      name: 'minimal-app',
      template: 'minimal',
    })

    const rootPath = join(tempDir, 'minimal-app')
    const packageJSON = JSON.parse(read(rootPath, 'package.json'))

    expect(execs).toEqual(['cd minimal-app && npm install', 'cd minimal-app && npm run test'])
    expect(listFiles(rootPath)).toEqual(minimalFiles)
    expect(packageJSON.name).toBe('minimal-app')
    expect(read(rootPath, 'package.json')).not.toContain('{{name}}')
    expectGeneratedSessionSecret(read(rootPath, 'src/faas.yaml'))
    expect(read(rootPath, 'server.ts')).toContain("import { loadEnvFile } from 'node:process'")
    expect(read(rootPath, 'server.ts')).toContain('try {')
    expect(read(rootPath, 'server.ts')).toContain('loadEnvFile()')
    expect(read(rootPath, 'server.ts')).toContain(
      "console.warn('[faasjs] Failed to load env file', error)",
    )
    expect(read(rootPath, 'src/pages/home/api/hello.api.ts')).toContain('export default defineApi(')
    expect(read(rootPath, 'src/pages/home/api/__tests__/hello.test.ts')).toContain(
      "import api from '../hello.api'",
    )
    expect(read(rootPath, 'src/react-client.ts')).toContain(
      "import { FaasReactClient } from '@faasjs/react'",
    )
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain(
      "import { faas } from '../../react-client'",
    )
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain('FaasJS Minimal App')
  })

  it('should reject an unknown template', async () => {
    await expect(
      action({
        name: 'broken-app',
        template: 'unknown',
      }),
    ).rejects.toThrow('Unknown template "unknown". Available templates: admin, minimal')

    expect(execs).toEqual([])
  })
})
