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
        'test/biome.json',
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
      start: 'node server.ts',
      check: 'tsc --noEmit && biome check .',
      test: 'vitest run',
    })

    expect(packageJSON.dependencies).toEqual(
      expect.objectContaining({
        '@faasjs/func': '*',
        '@faasjs/http': '*',
        '@faasjs/knex': '*',
        pg: '*',
      })
    )

    expect(packageJSON.devDependencies).toEqual(
      expect.objectContaining({
        '@electric-sql/pglite': '*',
        'knex-pglite': '*',
      })
    )

    expect(files['test/src/pages/home/api/hello.func.ts']).toContain(
      "import { defineFunc } from '@faasjs/func'"
    )
    expect(files['test/src/pages/home/api/hello.func.ts']).not.toContain(
      'useHttpFunc'
    )

    expect(files['test/.gitignore']).toEqual(`node_modules/
dist/
coverage/
.pglite_dev/
`)

    expect(files['test/src/faas.yaml']).toContain('connection: ./.pglite_dev')
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
