/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from '../action'

let execs: string[] = []

jest.mock('child_process', function () {
  return {
    execSync (cmd: string) {
      execs.push(cmd)
    }
  }
})

let dirs: string[] = []
let files: {
  [key: string]: string;
} = {}

jest.mock('fs', function () {
  return {
    mkdirSync (path: string) {
      dirs.push(path)
    },
    writeFileSync (name: string, body: string) {
      files[name] = body
    },
    existsSync () {}
  }
})

describe('action', function () {
  beforeEach(function () {
    execs = []
    dirs = []
    files = {}
  })

  it('without example', async function () {
    await action({
      name: 'test',
      example: false
    })

    expect(execs).toEqual(['cd test && npm install'])
    expect(dirs).toEqual(['test', 'test/.vscode'])
    expect(Object.keys(files)).toEqual([
      'test/faas.yaml',
      'test/package.json',
      'test/tsconfig.json',
      'test/.gitignore',
      'test/.vscode/settings.json',
      'test/.vscode/extensions.json',
    ])
    expect(files['test/.gitignore']).toEqual(`node_modules/
tmp/
coverage/
*.tmp.js
`)
  })

  it('with example', async function () {
    await action({
      name: 'test',
      example: true
    })

    expect(execs).toEqual(['cd test && npm install', 'cd test && npm exec jest'])
    expect(dirs).toEqual([
      'test',
      'test/.vscode',
      'test/__tests__',
    ])
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
