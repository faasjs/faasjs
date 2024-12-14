/**
 * FaasJS's logger module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/logger.svg)](https://github.com/faasjs/faasjs/blob/main/packages/logger/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/logger.svg)](https://www.npmjs.com/package/@faasjs/logger)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/logger
 * ```
 *
 * @packageDocumentation
 */
import { format } from 'node:util'
import { Color } from './color'

export { Color }

/** Logger Level */
export type Level = 'debug' | 'info' | 'warn' | 'error'

enum LevelColor {
  debug = Color.GRAY,
  info = Color.GREEN,
  warn = Color.ORANGE,
  error = Color.RED,
}

type Timer = {
  level: Level
  time: number
}

const LevelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * Logger Class
 *
 * Support env:
 * - FaasLog: debug, info, warn, error (default: debug)
 * - FaasLogSize: 1000 (default: 1000)
 * - FaasLogMode: plain, pretty (default: pretty)
 *
 * @example
 * ```ts
 * const logger = new Logger()
 *
 * logger.debug('debug message')
 * logger.info('info message')
 * logger.warn('warn message')
 * logger.error('error message')
 *
 * logger.time('timer name')
 * logger.timeEnd('timer name', 'message') // => 'message +1ms'
 * ```
 */
export class Logger {
  public silent = false
  public level = 0
  public colorfyOutput = true
  public label?: string
  public size = 1000
  public stdout: (text: string) => void
  public stderr: (text: string) => void
  private cachedTimers: Record<string, Timer> = {}

  /**
   * @param label {string} Prefix label
   */
  constructor(label?: string) {
    if (label) this.label = label

    // When run with Jest and --silent, logger won't output anything
    if (
      !process.env.FaasLog &&
      process.env.npm_config_argv &&
      JSON.parse(process.env.npm_config_argv).original.includes('--silent')
    )
      this.silent = true

    switch (process.env.FaasLogMode) {
      case 'plain':
        this.colorfyOutput = false
        break
      case 'pretty':
        this.colorfyOutput = true
        break
      default:
        this.colorfyOutput = process.env.FaasMode !== 'remote'
        break
    }

    if (process.env.FaasLog)
      this.level = LevelPriority[process.env.FaasLog.toLowerCase() as Level]

    this.cachedTimers = {}

    if (process.env.FaasLogSize) this.size = Number(process.env.FaasLogSize)

    this.stdout = console.log
    this.stderr = console.error
  }

  /**
   * @param message {string} message
   * @param args {...any=} arguments
   */
  public debug(message: string, ...args: any[]): Logger {
    this.log('debug', message, ...args)
    return this
  }

  /**
   * @param message {string} message
   * @param args {...any=} arguments
   */
  public info(message: string, ...args: any[]): Logger {
    this.log('info', message, ...args)
    return this
  }

  /**
   * @param message {string} message
   * @param args {...any=} arguments
   */
  public warn(message: string, ...args: any[]): Logger {
    this.log('warn', message, ...args)
    return this
  }

  /**
   * @param message {any} message or Error object
   * @param args {...any=} arguments
   */
  public error(message: string | Error, ...args: any[]): Logger {
    this.log('error', message, ...args)

    return this
  }

  /**
   * @param key {string} timer's label
   * @param level [string=debug] 日志级别，支持 debug、info、warn、error
   */
  public time(key: string, level: Level = 'debug'): Logger {
    this.cachedTimers[key] = {
      level,
      time: Date.now(),
    }

    return this
  }

  /**
   * @param key {string} timer's label
   * @param message {string} message
   * @param args {...any=} arguments
   */
  public timeEnd(key: string, message: string, ...args: any[]): Logger {
    if (this.cachedTimers[key]) {
      const timer: Timer = this.cachedTimers[key]

      message = `${message} +%ims`
      args.push(Date.now() - timer.time)

      this[timer.level](message, ...args)

      delete this.cachedTimers[key]
    } else {
      this.warn('timeEnd not found key %s', key)
      this.debug(message)
    }
    return this
  }

  /**
   * @param message {string} message
   * @param args {...any=} arguments
   */
  public raw(message: string, ...args: any[]): Logger {
    if (this.silent) return this

    this.stdout(format(message, ...args))

    return this
  }

  /**
   * @param color {number} color code
   * @param message {string} message
   */
  public colorfy(color: number, message: string): string {
    return `\u001b[0${color}m${message}\u001b[39m`
  }

  private log(level: Level, message: string | Error, ...args: any): Logger {
    if (this.silent) return this

    if (LevelPriority[level] < this.level) return this

    let output = `${level.toUpperCase()} ${
      this.label ? `[${this.label}] ` : ''
    }${format(message, ...args)}`

    if (this.colorfyOutput) output = this.colorfy(LevelColor[level], output)
    else if (!this.colorfyOutput) output = output.replace(/\n/g, '')

    if (!output) return this

    if (
      this.size > 0 &&
      output.length > this.size &&
      !['error', 'warn'].includes(level)
    )
      output = `${output.slice(0, this.size - 100)}...${output.slice(
        output.length - 100
      )}`

    if (level === 'error') this.stderr(output)
    else this.stdout(output)

    return this
  }
}
