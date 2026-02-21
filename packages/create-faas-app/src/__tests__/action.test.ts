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
        'test/src/db/migrations/.gitkeep',
        'test/src/main.tsx',
        'test/src/pages/home/index.tsx',
        'test/src/pages/home/api/hello.func.ts',
        'test/src/pages/home/api/__tests__/hello.test.ts',
      ])
    )

    const packageJSON = JSON.parse(files['test/package.json'])

    expect(packageJSON.scripts).toMatchObject({
      dev: 'vite',
      build: 'vite build',
      start: 'node server.ts',
      check: 'faas lint',
      test: 'vitest run',
      'migrate:latest': expect.any(String),
      'migrate:rollback': expect.any(String),
      'migrate:status': expect.any(String),
      'migrate:current': expect.any(String),
      'migrate:make': expect.any(String),
    })

    expect(packageJSON.scripts['migrate:latest']).toEqual('faas knex latest')
    expect(packageJSON.scripts['migrate:rollback']).toEqual(
      'faas knex rollback'
    )
    expect(packageJSON.scripts['migrate:status']).toEqual('faas knex status')
    expect(packageJSON.scripts['migrate:current']).toEqual('faas knex current')
    expect(packageJSON.scripts['migrate:make']).toEqual('faas knex make')

    expect(packageJSON.dependencies).toEqual(
      expect.objectContaining({
        '@faasjs/core': '*',
        pg: '*',
      })
    )

    expect(packageJSON.devDependencies).toEqual(
      expect.objectContaining({
        '@electric-sql/pglite': '*',
        'knex-pglite': '*',
        oxlint: '*',
      })
    )

    expect(files['test/src/pages/home/api/hello.func.ts']).toContain(
      "import { defineApi, z } from '@faasjs/core'"
    )
    expect(files['test/src/pages/home/api/hello.func.ts']).toContain('schema,')

    expect(files['test/.gitignore']).toEqual(`node_modules/
dist/
coverage/
.pglite_dev/
`)

    expect(files['test/src/faas.yaml']).toContain('connection: ./.pglite_dev')
    expect(files['test/src/faas.yaml']).toContain(
      'directory: ./src/db/migrations'
    )
    expect(files['test/src/faas.yaml']).toContain('extension: ts')
    expect(files['test/src/faas.yaml']).toContain('production:')

    const testingSection = files['test/src/faas.yaml']
      .split('testing:')[1]
      .split('production:')[0]

    expect(testingSection).toContain('client: pglite')
    expect(testingSection).not.toContain('connection:')

    const productionSection =
      files['test/src/faas.yaml'].split('production:')[1]

    expect(productionSection).toContain('client: pg')
  })
})
