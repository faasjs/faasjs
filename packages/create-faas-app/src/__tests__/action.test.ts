import { action } from '../action'

let execs: string[] = []

jest.mock('node:child_process', () => ({
  execSync(cmd: string) {
    execs.push(cmd)
  },
}))

let dirs: string[] = []
let files: {
  [key: string]: string
} = {}

jest.mock('node:fs', () => ({
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

    expect(execs).toEqual(['cd test && npm install', 'cd test && npm run test'])
    expect(dirs).toEqual(['test', 'test/.vscode', 'test/__tests__'])
    expect(Object.keys(files)).toEqual([
      'test/faas.yaml',
      'test/package.json',
      'test/tsconfig.json',
      'test/.gitignore',
      'test/.vscode/settings.json',
      'test/.vscode/extensions.json',
      'test/index.func.ts',
      'test/__tests__/index.test.ts',
    ])
    expect(files['test/.gitignore']).toEqual(`node_modules/
tmp/
coverage/
*.tmp.js
`)
  })
})
