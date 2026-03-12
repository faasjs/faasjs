import { beforeEach, describe, expect, it, vi } from 'vitest'
import { action } from '../action'

let execs: string[] = []

vi.mock('node:child_process', () => ({
  execSync(cmd: string) {
    execs.push(cmd)
  },
}))

let dirs: string[] = []
let files: {
  [key: string]: string
} = {}

vi.mock('node:fs', () => ({
  mkdirSync(path: string) {
    dirs.push(path)
  },
  writeFileSync(name: string, body: string) {
    files[name] = body
  },
  existsSync() {},
}))

describe('action', () => {
  beforeEach(() => {
    execs = []
    dirs = []
    files = {}
  })

  it('should work', async () => {
    await action({
      name: 'test',
    })

    expect(execs).toHaveLength(2)
    expect(execs[0]).toMatch(/^cd test && (npm|bun) install$/)
    expect(execs[1]).toMatch(/^cd test && (npm run test|bun test)$/)
    expect(dirs).toContain('test')
    expect(Object.keys(files)).toEqual(
      expect.arrayContaining([
        'test/package.json',
        'test/tsconfig.json',
        'test/index.html',
        'test/vite.config.ts',
        'test/server.ts',
        'test/src/faas.yaml',
        'test/src/main.tsx',
        'test/src/pages/home/index.tsx',
        'test/src/pages/home/api/hello.func.ts',
        'test/src/pages/home/api/__tests__/hello.test.ts',
      ])
    )

    const packageJSON = JSON.parse(files['test/package.json'])

    expect(packageJSON.scripts).toEqual({
      dev: 'vite',
      build: 'vite build',
      start: 'node --import @faasjs/node-utils/register-hooks server.ts',
      check: 'faas lint',
      test: 'vitest run',
    })

    expect(packageJSON.dependencies).toEqual({
      '@faasjs/core': '*',
      react: '*',
      'react-dom': '*',
    })

    expect(packageJSON.devDependencies).toEqual({
      '@faasjs/dev': '*',
      '@types/node': '*',
      '@types/react': '*',
      '@types/react-dom': '*',
      '@vitejs/plugin-react': '*',
      jsdom: '*',
      oxlint: '*',
      typescript: '*',
      vite: '*',
      vitest: '*',
    })

    expect(files['test/src/pages/home/api/hello.func.ts']).toContain(
      "import { defineApi, z } from '@faasjs/core'"
    )
    expect(files['test/src/pages/home/api/hello.func.ts']).toContain('schema,')

    expect(files['test/.gitignore']).toEqual(`node_modules/
dist/
coverage/
`)

    expect(files['test/src/faas.yaml']).toEqual(`defaults:
  server:
    root: .
    base: /
  plugins:
    http:
      config:
        cookie:
          secure: false
          session:
            secret: secret
`)
  })
})
