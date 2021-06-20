import { format } from 'util'
import { Color } from './color'

export { Color }

export type Level = 'debug' | 'info' | 'warn' | 'error'

enum LevelColor {
  debug = Color.GRAY,
  info = Color.GREEN,
  warn = Color.ORANGE,
  error = Color.RED
}

interface Timer {
  level: Level
  time: number
}

const LevelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

/**
 * 日志类
 */
export default class Logger {
  public silent: boolean
  public level: number
  public mode: string
  public label?: string
  public stdout: (text: string) => void
  public stderr: (text: string) => void
  private cachedTimers: any

  /**
   * 初始化日志
   * @param label {string} 日志前缀
   */
  constructor (label?: string) {
    if (label) this.label = label

    // 当使用 Jest 进行测试且使用 --silent 参数时禁止日志输出
    this.silent = !process.env.FaasLog &&
      process.env.npm_config_argv &&
      JSON.parse(process.env.npm_config_argv).original.includes('--silent')

    this.mode = process.env.FaasMode !== 'remote' ? 'local' : 'remote'
    this.level = process.env.FaasLog ? LevelPriority[process.env.FaasLog.toLowerCase()] : 0

    this.cachedTimers = {}

    this.stdout = console.log
    this.stderr = console.error
  }

  /**
   * 调试级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public debug (message: string, ...args: any[]): Logger {
    this.log('debug', message, ...args)
    return this
  }

  /**
   * 信息级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public info (message: string, ...args: any[]): Logger {
    this.log('info', message, ...args)
    return this
  }

  /**
   * 警告级别日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public warn (message: string, ...args: any[]): Logger {
    this.log('warn', message, ...args)
    return this
  }

  /**
   * 错误级别日志
   * @param message {any} 日志内容，可以为 Error 对象
   * @param args {...any=} 内容参数
   */
  public error (message: string | Error, ...args: any[]): Logger {
    let stack = false;
    [message].concat(Array.from(args)).forEach((e: any) => {
      if (e.stack) {
        stack = true
        this.log('error', e.stack)
      }
    })

    if (!stack) this.log('error', message, ...args)

    return this
  }

  /**
   * 设置一个计时器
   * @param key {string} 计时器标识
   * @param level [string=debug] 日志级别，支持 debug、info、warn、error
   */
  public time (key: string, level: Level = 'debug'): Logger {
    this.cachedTimers[key] = {
      level,
      time: new Date().getTime()
    }

    return this
  }

  /**
   * 结束计时并显示日志
   * @param key {string} 计时器标识
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public timeEnd (key: string, message: string, ...args: any[]): Logger {
    if (this.cachedTimers[key]) {
      const timer: Timer = this.cachedTimers[key]

      message = message + ' +%ims'
      args.push(new Date().getTime() - timer.time)

      this[timer.level](message, ...args)

      delete this.cachedTimers[key]
    } else {
      this.warn('timeEnd not found key %s', key)
      this.debug(message)
    }
    return this
  }

  /**
   * 纯输出日志
   * @param message {string} 日志内容
   * @param args {...any=} 内容参数
   */
  public raw (message: string, ...args: any[]): Logger {
    if (this.silent) return this

    this.stdout(format(message, ...args))

    return this
  }

  /**
   * 文本染色
   * @param color {number} 颜色代码
   * @param message {string} 文本内容
   */
  public colorfy (color: number, message: string): string {
    return `\u001b[0${color}m${message}\u001b[39m`
  }

  private log (level: Level, message: string | Error, ...args: any): Logger {
    if (this.silent) return this

    if (LevelPriority[level] < this.level) return this

    let output = level.toUpperCase() + ' ' + (this.label ? `[${this.label}] ` : '') + format(message, ...args)

    if (this.mode === 'local' && level !== 'error') output = this.colorfy(LevelColor[level], output); else if (this.mode !== 'local') output = output.replace(/\n/g, '')

    if (this.mode === 'remote') console.log(output); else if (level === 'error') this.stderr(output); else this.stdout(output)

    return this
  }
}
