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

const basicFiles = [
  '.gitignore',
  'index.html',
  'package.json',
  'server.ts',
  'src/faas.yaml',
  'src/main.tsx',
  'src/pages/home/api/__tests__/hello.test.ts',
  'src/pages/home/api/hello.func.ts',
  'src/pages/home/index.tsx',
  'src/react-client.ts',
  'tsconfig.json',
  'vite.config.ts',
]

const antdFiles = [
  '.gitignore',
  'index.html',
  'package.json',
  'server.ts',
  'src/faas.yaml',
  'src/main.tsx',
  'src/pages/home/api/__tests__/hello.test.ts',
  'src/pages/home/api/hello.func.ts',
  'src/pages/home/index.tsx',
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

  it('should create the basic template by default', async () => {
    await action({
      name: 'basic-app',
    })

    const rootPath = join(tempDir, 'basic-app')
    const packageJSON = JSON.parse(read(rootPath, 'package.json'))

    expect(execs).toEqual([
      expect.stringMatching(/^cd basic-app && (npm|bun) install$/),
      expect.stringMatching(/^cd basic-app && (npm run test|bun test)$/),
    ])
    expect(listFiles(rootPath)).toEqual(basicFiles)
    expect(packageJSON.name).toBe('basic-app')
    expect(read(rootPath, 'package.json')).not.toContain('{{name}}')
    expectGeneratedSessionSecret(read(rootPath, 'src/faas.yaml'))
    expect(read(rootPath, 'src/react-client.ts')).toContain(
      "import { FaasReactClient } from '@faasjs/react'",
    )
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain(
      "import { faas } from '../../react-client'",
    )
  })

  it('should create the antd template when requested', async () => {
    await action({
      name: 'antd-app',
      template: 'antd',
    })

    const rootPath = join(tempDir, 'antd-app')
    const packageJSON = JSON.parse(read(rootPath, 'package.json'))

    expect(execs).toEqual([
      expect.stringMatching(/^cd antd-app && (npm|bun) install$/),
      expect.stringMatching(/^cd antd-app && (npm run test|bun test)$/),
    ])
    expect(listFiles(rootPath)).toEqual(antdFiles)
    expect(packageJSON.name).toBe('antd-app')
    expect(read(rootPath, 'package.json')).not.toContain('{{name}}')
    expectGeneratedSessionSecret(read(rootPath, 'src/faas.yaml'))
    expect(read(rootPath, 'src/main.tsx')).toContain("import { App } from '@faasjs/ant-design'")
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain(
      "import { faas, useApp } from '@faasjs/ant-design'",
    )
    expect(read(rootPath, 'src/pages/home/index.tsx')).toContain(
      "import { Button, Card, Input, Space, Typography } from 'antd'",
    )
    expect(listFiles(rootPath)).not.toContain('src/react-client.ts')
  })

  it('should reject an unknown template', async () => {
    await expect(
      action({
        name: 'broken-app',
        template: 'unknown',
      }),
    ).rejects.toThrow('Unknown template "unknown". Available templates: antd, basic')

    expect(execs).toEqual([])
  })
})
