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
    expect(files['test/.gitignore']).toEqual(`node_modules/
dist/
coverage/
`)
  })
})
