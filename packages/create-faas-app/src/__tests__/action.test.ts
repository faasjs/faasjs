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

let mkdirs: string[] = []
let files: {
  [key: string]: string;
} = {}

jest.mock('fs', function () {
  return {
    mkdirSync (path: string) {
      mkdirs.push(path)
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
    mkdirs = []
    files = {}
  })

  it('noprovider', async function () {
    await action({
      name: 'test',
      noprovider: true,
      example: false
    })

    expect(execs).toEqual(['yarn --cwd test install'])
    expect(mkdirs).toEqual(['test', 'test/.vscode'])
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

  it('with provider', async function () {
    await action({
      name: 'test',
      provider: 'tencentcloud',
      region: 'ap-beijing',
      appId: '1',
      secretId: 'secretId',
      secretKey: 'secretKey',
      example: false
    })

    expect(execs).toEqual(['yarn --cwd test install'])
    expect(mkdirs).toEqual(['test', 'test/.vscode'])
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
