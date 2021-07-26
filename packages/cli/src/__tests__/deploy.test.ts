/* eslint-disable @typescript-eslint/no-empty-function */
import { action } from '../commands/deploy'

let logs: string[] = []
let warns: string[] = []
let errors: string[] = []

jest.mock('console', function () {
  return {
    log: function (message: string) {
      logs.push(message)
    },
    warn: function (message: string) {
      warns.push(message)
    },
    error: function (message: string) {
      errors.push(message)
    }
  }
})

jest.mock('readline', function () {
  return {
    createInterface: function () {
      return {
        question: function (_, handler) {
          handler('y')
        },
        close: function () {}
      }
    }
  }
})

let messages = []
process.send = function (data) {
  messages.push(data)
  return true
}

let triggerMessage

jest.mock('cluster', function () {
  return {
    fork: function () {
      return {
        on: function (event: string, hanlder: (...args: any) => void) {
          if (event === 'exit') hanlder()
          if (event === 'message' && triggerMessage) hanlder(triggerMessage)
        }
      }
    }
  }
})

jest.mock('@faasjs/request', function () {
  return async function () {
    return Promise.resolve({})
  }
})

let deployeds: string[] = []
let deployPass = true

jest.mock('@faasjs/deployer', function () {
  return {
    Deployer: class Deployer {
      constructor (data) {
        deployeds.push(data.filename)
      }
      deploy () {
        if (!deployPass) throw Error('deployPass')
      }
    }
  }
})

describe('deploy', function () {
  afterEach(function () {
    logs = []
    warns = []
    errors = []
    deployeds = []
    deployPass = true
    messages = []
    delete process.env.FaasDeployFiles
    triggerMessage = null
  })

  describe('basic', function () {
    test('file', async function () {
      await expect(action('testing', [__dirname + '/funcs/a.func.ts'], {
        autoRetry: '0',
        workers: '1'
      })).resolves.toBeUndefined()

      expect(logs).toEqual([])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })

    test('folder', async function () {
      await action('testing', [__dirname + '/funcs'], {
        autoRetry: '0',
        workers: '1'
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 1，失败自动重试 0 次)',
        [__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'],
        '',
        '开始发布'
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })

  describe('worker', function () {
    it('done', async function () {
      process.env.FaasDeployFiles = [__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'].join(',')

      await action('testing', [], {
        autoRetry: '0',
        workers: '3'
      })

      expect(logs).toEqual([])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
      expect(deployeds).toEqual([__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'])
    })

    it('fail', async function () {
      deployPass = false
      process.env.FaasDeployFiles = [__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'].join(',')

      await action('testing', [], {
        autoRetry: '0',
        workers: '3'
      })

      expect(messages).toEqual([
        {
          type: 'fail',
          file: __dirname + '/funcs/a.func.ts'
        },
        {
          type: 'fail',
          file: __dirname + '/funcs/b.func.ts',
        }
      ])
      expect(logs).toEqual([])
      expect(warns).toEqual([])
      expect(errors).toEqual([
        Error('deployPass'),
        Error(__dirname + '/funcs/a.func.ts 自动重试次数已满，结束重试'),
        Error('deployPass'),
        Error(__dirname + '/funcs/b.func.ts 自动重试次数已满，结束重试')
      ])
      expect(deployeds).toEqual([__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'])
    })
  })

  describe('master', function () {
    it('fail', async function () {
      triggerMessage = {
        type: 'fail',
        file: 'file'
      }
      await action('testing', [__dirname + '/funcs'], {
        autoRetry: '0',
        workers: '3'
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 2，失败自动重试 0 次)',
        [__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'],
        '',
        '开始发布'
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual(['部署失败：', ['file', 'file']])
    })
  })

  describe('options', function () {
    test('autoRetry', async function () {
      deployPass = false
      await expect(action('testing', [__dirname + '/funcs/a.func.ts'], {
        autoRetry: '1',
        workers: '1'
      })).rejects.toEqual(Error(__dirname + '/funcs/a.func.ts 自动重试次数已满，结束重试'))

      expect(logs.length).toEqual(1)
      expect(logs[0]).toContain('等待 ')
      expect(warns).toEqual([__dirname + '/funcs/a.func.ts 自动重试（剩余 1 次）'])
      expect(errors).toEqual([Error('deployPass'), Error('deployPass')])
    })

    test('workers', async function () {
      await action('testing', [__dirname + '/funcs'], {
        autoRetry: '0',
        workers: '3'
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 2，失败自动重试 0 次)',
        [__dirname + '/funcs/a.func.ts', __dirname + '/funcs/b.func.ts'],
        '',
        '开始发布'
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })
})
