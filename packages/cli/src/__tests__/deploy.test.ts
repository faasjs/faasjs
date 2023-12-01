import { action } from '../commands/deploy'

let logs: string[] = []
let warns: string[] = []
let errors: string[] = []

jest.mock('console', () => ({
  log: (message: string) => {
    logs.push(message)
  },
  warn: (message: string) => {
    warns.push(message)
  },
  error: (message: string) => {
    errors.push(message)
  },
}))

jest.mock('readline', () => ({
  createInterface: () => ({
    question: (_: any, handler: (input: string) => void) => {
      handler('y')
    },
    close: () => {},
  }),
}))

let messages = []
process.send = data => {
  messages.push(data)
  return true
}

let triggerMessage: {
  type: string
  file: string
}

jest.mock('cluster', () => ({
  fork: () => ({
    on: (event: string, handler: (...args: any) => void) => {
      if (event === 'exit') handler()
      if (event === 'message' && triggerMessage) handler(triggerMessage)
    },
  }),
}))

jest.mock('@faasjs/request', () => async () => Promise.resolve({}))

let deploys: string[] = []
let deployPass = true

jest.mock('@faasjs/deployer', () => ({
  Deployer: class Deployer {
    constructor(data: any) {
      deploys.push(data.filename)
    }
    deploy() {
      if (!deployPass) throw Error('deployPass')
    }
  },
}))

describe('deploy', () => {
  afterEach(() => {
    logs = []
    warns = []
    errors = []
    deploys = []
    deployPass = true
    messages = []
    delete process.env.FaasDeployFiles
    triggerMessage = null
  })

  describe('basic', () => {
    test('file', async () => {
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

    test('folder', async () => {
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

  describe('workers', () => {
    it('fail', async () => {
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

  describe('options', () => {
    test('autoRetry', async () => {
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

    test('workers', async () => {
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
