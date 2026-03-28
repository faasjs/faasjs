import { colorfy } from './color'
import { format } from './format'
import { getTransport } from './transport'

/**
 * Supported log levels used by {@link Logger} and {@link Transport}.
 */
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
 * Format logger arguments into a printable string.
 *
 * Values marked with `__hidden__: true` are skipped so callers can attach transport-only metadata.
 * When formatting fails, the formatter returns a fallback error message instead of throwing.
 *
 * @param {any} fmt - Format string or first value to log.
 * @param {any[]} args - Additional values passed to the formatter.
 * @returns {string} Formatted log message.
 *
 * @example
 * ```ts
 * import { formatLogger } from '@faasjs/node-utils'
 *
 * formatLogger('Hello %s', 'FaasJS') // 'Hello FaasJS'
 * ```
 */
export function formatLogger(fmt: any, ...args: any[]): string {
  try {
    return format(
      fmt,
      ...args.filter((a: any) => !a || typeof a !== 'object' || a.__hidden__ !== true),
    )
  } catch (e: any) {
    return `[Unable to format] ${e?.message}`
  }
}

/**
 * Write level-filtered log output with optional labels, colors, timers, and transport forwarding.
 *
 * When `process` is available, the constructor reads `FaasLog`, `FaasLogMode`, `FaasLogSize`,
 * and `FaasLogTransport` to derive the initial logger behavior.
 *
 * @see {@link getTransport}
 * @example
 * ```ts
 * import { Logger } from '@faasjs/node-utils'
 *
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
  /**
   * When true, suppresses all output and transport forwarding.
   *
   * @default false
   */
  public silent = false
  /**
   * Minimum level that will be emitted.
   *
   * @default 'debug'
   */
  public level: Level = 'debug'
  /**
   * Whether terminal output should use ANSI colors.
   *
   * @default true
   */
  public colorfyOutput = true
  /**
   * Optional label prefix included in log lines.
   */
  public label?: string
  /**
   * Maximum plain-text payload length before non-error logs are truncated.
   *
   * @default 1000
   */
  public size = 1000
  /**
   * Disable forwarding log messages to the shared transport.
   *
   * @default false
   */
  public disableTransport = false
  /**
   * Output function used for non-error logs.
   *
   * @default console.log
   */
  public stdout: (text: string) => void = console.log
  /**
   * Output function used for error logs.
   *
   * @default console.error
   */
  public stderr: (text: string) => void = console.error
  private cachedTimers: Record<string, Timer> = {}

  /**
   * Create a logger with an optional label prefix.
   *
   * @param {string} [label] - Prefix label shown in log output.
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

    if (process.env.FaasLog) this.level = process.env.FaasLog.toLowerCase() as Level

    if (process.env.FaasLogSize) this.size = Number(process.env.FaasLogSize)
  }

  /**
   * Write a debug log entry.
   *
   * @param {string} message - Log message or format string.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
   */
  public debug(message: string, ...args: any[]): Logger {
    this.log('debug', message, ...args)
    return this
  }

  /**
   * Write an info log entry.
   *
   * @param {string} message - Log message or format string.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
   */
  public info(message: string, ...args: any[]): Logger {
    this.log('info', message, ...args)
    return this
  }

  /**
   * Write a warning log entry.
   *
   * @param {string} message - Log message or format string.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
   */
  public warn(message: string, ...args: any[]): Logger {
    this.log('warn', message, ...args)
    return this
  }

  /**
   * Write an error log entry.
   *
   * @param {unknown} message - Log message, format string, or `Error` object.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
   */
  public error(message: unknown, ...args: any[]): Logger {
    this.log('error', message, ...args)

    return this
  }

  /**
   * Start a named timer that will log its duration when ended.
   *
   * @param {string} key - Unique identifier for the timer.
   * @param {Level} [level='debug'] - Log level used when the timer ends.
   * @returns {Logger} The current logger for chaining.
   */
  public time(key: string, level: Level = 'debug'): Logger {
    this.cachedTimers[key] = {
      level,
      time: Date.now(),
    }

    return this
  }

  /**
   * Stop a named timer and log the elapsed duration.
   *
   * If the timer key does not exist, the logger emits a warning and then writes the provided message at debug level.
   *
   * @param {string} key - Unique identifier for the timer.
   * @param {string} message - Message to log alongside the elapsed time.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
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
   * Write raw output without adding log level prefixes.
   *
   * @param {string} message - Log message or format string.
   * @param {any[]} args - Additional values forwarded to the formatter.
   * @returns {Logger} The current logger for chaining.
   */
  public raw(message: string, ...args: any[]): Logger {
    if (this.silent) return this

    this.stdout(formatLogger(message, ...args))

    return this
  }

  private log(level: Level, message: unknown, ...args: any): Logger {
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

    if (this.size > 0 && output.length > this.size && !['error', 'warn'].includes(level))
      output = `${output.slice(0, this.size - 100)}...[truncated]...${output.slice(
        output.length - 100,
      )}`

    if (level === 'error') this.stderr(output)
    else this.stdout(output)

    return this
  }
}
