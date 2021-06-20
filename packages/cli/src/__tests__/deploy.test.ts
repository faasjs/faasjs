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

jest.mock('cluster', function () {
  return {
    on: function () {},
    fork: function () {
      return { on: function () {} }
    }
  }
})

jest.setTimeout(15000)

describe('deploy', function () {
  afterEach(function () {
    logs = []
    warns = []
    errors = []
  })

  describe('basic', function () {
    test('file', async function () {
      await expect(action('testing', [__dirname + '/funcs/a.func.ts'], {
        ar: '0',
        w: '1'
      })).rejects.toEqual(Error(__dirname + '/funcs/a.func.ts 自动重试次数已满，结束重试'))

      expect(logs).toEqual([])
      expect(warns).toEqual([])
      expect(errors).toEqual([
        Error('Missing secretId or secretKey!')
      ])
    })

    test('folder', async function () {
      await action('testing', [__dirname + '/funcs'], {
        ar: '0',
        w: '1'
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 1，失败自动重试 0 次)',
        [
          __dirname + '/funcs/a.func.ts',
          __dirname + '/funcs/b.func.ts'
        ],
        '',
        '开始发布'
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })

  describe('options', function () {
    test('ar', async function () {
      await expect(action('testing', [__dirname + '/funcs/a.func.ts'], {
        ar: '1',
        w: '1'
      })).rejects.toEqual(Error(__dirname + '/funcs/a.func.ts 自动重试次数已满，结束重试'))

      expect(logs.length).toEqual(1)
      expect(logs[0]).toContain('等待 ')
      expect(warns).toEqual([
        __dirname + '/funcs/a.func.ts 自动重试（剩余 1 次）'
      ])
      expect(errors).toEqual([
        Error('Missing secretId or secretKey!'),
        Error('Missing secretId or secretKey!')
      ])
    })

    test('w', async function () {
      await action('testing', [__dirname + '/funcs'], {
        ar: '0',
        w: '3'
      })

      expect(logs).toEqual([
        '[testing] 是否要发布以下 2 个云函数？(并行数 2，失败自动重试 0 次)',
        [
          __dirname + '/funcs/a.func.ts',
          __dirname + '/funcs/b.func.ts'
        ],
        '',
        '开始发布'
      ])
      expect(warns).toEqual([])
      expect(errors).toEqual([])
    })
  })
})
