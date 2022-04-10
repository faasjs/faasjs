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

  it('should work', async function () {
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
    ])
    expect(files['test/.gitignore']).toEqual(`node_modules/
tmp/
coverage/
*.tmp.js
`)
  })
})
