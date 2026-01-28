import { colorfy } from './color'
import { format } from './format'
import { getTransport } from './transport'

/** Logger Level */
export type Level = 'debug' | 'info' | 'warn' | 'error'

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
 * Formats the provided arguments into a string, filtering out any objects
 * with a `__hidden__` property set to `true`. If formatting fails, it attempts
 * to stringify each argument individually.
 *
 * @param {...any[]} args - The arguments to format.
 * @returns {string} The formatted string.
 */
export function formatLogger(fmt: any, ...args: any[]): string {
  try {
    return format(
      fmt,
      ...args.filter(
        (a: any) => !a || typeof a !== 'object' || a.__hidden__ !== true
      )
    )
  } catch (e: any) {
    return `[Unable to format] ${e?.message}`
  }
}

/**
 * Logger Class
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
  public level: Level = 'debug'
  public colorfyOutput = true
  public label?: string
  public size = 1000
  public disableTransport = false
  public stdout: (text: string) => void = console.log
  public stderr: (text: string) => void = console.error
  private cachedTimers: Record<string, Timer> = {}

  /**
   * @param label {string} Prefix label
   */
  constructor(label?: string) {
    if (label) this.label = label

    if (typeof process === 'undefined') return

    if (
      !process.env.FaasLog &&
      process.env.npm_config_argv &&
      JSON.parse(process.env.npm_config_argv).original.includes('--silent')
    )
      this.silent = true

    if (
      process.env.FaasLogTransport !== 'true' &&
      (process.env.VITEST || process.env.FaasLogTransport === 'false')
    )
      this.disableTransport = true

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
      this.level = process.env.FaasLog.toLowerCase() as Level

    if (process.env.FaasLogSize) this.size = Number(process.env.FaasLogSize)
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
  public error(message: string | Error | unknown, ...args: any[]): Logger {
    this.log('error', message, ...args)

    return this
  }

  /**
   * Start a timer with a specific key and log level.
   *
   * @param key - The unique identifier for the timer.
   * @param level - The log level for the timer. Defaults to 'debug'.
   * @returns The Logger instance for chaining.
   */
  public time(key: string, level: Level = 'debug'): Logger {
    this.cachedTimers[key] = {
      level,
      time: Date.now(),
    }

    return this
  }

  /**
   * End a timer with a specific key and log the elapsed time.
   *
   * @param key - The unique identifier for the timer.
   * @param message - The message to log with the elapsed time.
   * @param args - Additional arguments to log with the message.
   * @returns The Logger instance for chaining.
   */
  public timeEnd(key: string, message: string, ...args: any[]): Logger {
    if (this.cachedTimers[key]) {
      const timer: Timer = this.cachedTimers[key]
      const duration = Date.now() - timer.time

      message = `${message} +${duration}ms`

      args.push({
        __hidden__: true,
        performance: {
          name: key,
          startTime: timer.time,
          duration,
        },
      })

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

    this.stdout(formatLogger(message, ...args))

    return this
  }

  private log(
    level: Level,
    message: string | Error | unknown,
    ...args: any
  ): Logger {
    if (this.silent) return this

    if (LevelPriority[level] < LevelPriority[this.level]) return this

    const formattedMessage = formatLogger(message, ...args)

    if (!formattedMessage && !args.length) return this

    if (!this.disableTransport)
      getTransport().insert({
        level,
        labels: this.label?.split(/\]\s*\[/) || [],
        message: formattedMessage,
        timestamp: Date.now(),
        extra: args,
      })

    let output = `${level.toUpperCase()} ${this.label ? `[${this.label}] ` : ''}${formattedMessage}`

    if (this.colorfyOutput) output = colorfy(level, output)
    else if (!this.colorfyOutput) output = output.replace(/\n/g, '')

    if (!output) return this

    if (
      this.size > 0 &&
      output.length > this.size &&
      !['error', 'warn'].includes(level)
    )
      output = `${output.slice(0, this.size - 100)}...[truncated]...${output.slice(
        output.length - 100
      )}`

    if (level === 'error') this.stderr(output)
    else this.stdout(output)

    return this
  }
}
