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
    },
  }
})

jest.mock('readline', function () {
  return {
    createInterface: function () {
      return {
        question: function (_: any, handler: (input: string) => void) {
          handler('y')
        },
        close: function () {},
      }
    },
  }
})

let messages = []
process.send = function (data) {
  messages.push(data)
  return true
}

let triggerMessage: {
  type: string
  file: string
}

jest.mock('cluster', function () {
  return {
    fork: function () {
      return {
        on: function (event: string, handler: (...args: any) => void) {
          if (event === 'exit') handler()
          if (event === 'message' && triggerMessage) handler(triggerMessage)
        },
      }
    },
  }
})

jest.mock('@faasjs/request', function () {
  return async function () {
    return Promise.resolve({})
  }
})

let deploys: string[] = []
let deployPass = true

jest.mock('@faasjs/deployer', function () {
  return {
    Deployer: class Deployer {
      constructor(data: any) {
        deploys.push(data.filename)
      }
      deploy() {
        if (!deployPass) throw Error('deployPass')
      }
    },
  }
})

describe('deploy', function () {
  afterEach(function () {
    logs = []
    warns = []
    errors = []
    deploys = []
    deployPass = true
    messages = []
    delete process.env.FaasDeployFiles
    triggerMessage = null
  })

  describe('basic', function () {
    test('file', async function () {
      await expect(
        action('testing', [`${__dirname}/funcs/a.func.ts`], {
          autoRetry: '0',
          workers: '1',
        })
      ).resolves.toBeUndefined()

      expect(logs).toEqual([])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })

    test('folder', async function () {
      await action('testing', [`${__dirname}/funcs`], {
        autoRetry: '0',
        workers: '1',
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 1，失败自动重试 0 次)',
        expect.arrayContaining([
          `${__dirname}/funcs/a.func.ts`,
          `${__dirname}/funcs/b.func.ts`,
        ]),
        '',
        '开始发布',
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })

  describe('workers', function () {
    it('fail', async function () {
      triggerMessage = {
        type: 'fail',
        file: 'file',
      }
      await action('testing', [`${__dirname}/funcs`], {
        autoRetry: '0',
        workers: '3',
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 2，失败自动重试 0 次)',
        expect.arrayContaining([
          `${__dirname}/funcs/a.func.ts`,
          `${__dirname}/funcs/b.func.ts`,
        ]),
        '',
        '开始发布',
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual(['Failed:', ['file', 'file']])
    })
  })

  describe('options', function () {
    test('autoRetry', async function () {
      deployPass = false
      await expect(
        action('testing', [`${__dirname}/funcs/a.func.ts`], {
          autoRetry: '1',
          workers: '1',
        })
      ).rejects.toEqual(
        Error(`${__dirname}/funcs/a.func.ts 自动重试次数已满，结束重试`)
      )

      expect(logs.length).toEqual(1)
      expect(logs[0]).toContain('Waiting ')
      expect(warns).toEqual([
        `${__dirname}/funcs/a.func.ts 自动重试（剩余 1 次）`,
      ])
      expect(errors).toEqual([Error('deployPass'), Error('deployPass')])
    })

    test('workers', async function () {
      await action('testing', [`${__dirname}/funcs`], {
        autoRetry: '0',
        workers: '3',
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 2，失败自动重试 0 次)',
        expect.arrayContaining([
          `${__dirname}/funcs/a.func.ts`,
          `${__dirname}/funcs/b.func.ts`,
        ]),
        '',
        '开始发布',
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })
})
