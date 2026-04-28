import type { Level } from '../logger'

type ColorfyEnv = Record<string, string | undefined>

type ColorfyStream = {
  isTTY?: boolean
}

/**
 * ANSI color codes used by the built-in logger formatter.
 *
 * @example
 * ```ts
 * const color = Color.RED
 * ```
 */
export const Color = {
  DEFAULT: 39,
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  ORANGE: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  GRAY: 90,
}

/**
 * Default ANSI color mapping used by {@link Logger} for each log level.
 *
 * @example
 * ```ts
 * const levelColor = LevelColor.warn
 * ```
 */
export const LevelColor = {
  debug: Color.GRAY,
  info: Color.GREEN,
  warn: Color.ORANGE,
  error: Color.RED,
}

/**
 * Detect whether the current output target should receive ANSI colors.
 *
 * `FORCE_COLOR` forces colors on or off, `NO_COLOR` disables them, and regular
 * local output only enables colors when the target is a TTY.
 *
 * @param {ColorfyStream} [stream] - Output target used by the logger.
 * @param {ColorfyEnv} [env] - Environment variables used to override detection.
 * @returns {boolean} `true` when ANSI colors should be emitted.
 *
 * @example
 * ```ts
 * const enabled = supportsColorfyOutput({ isTTY: true }, process.env)
 * ```
 */
export function supportsColorfyOutput(stream?: ColorfyStream, env?: ColorfyEnv): boolean {
  if (!env) return false

  const forceColor = env.FORCE_COLOR?.toLowerCase()

  if (typeof forceColor !== 'undefined') return !['0', 'false'].includes(forceColor)

  if (typeof env.NO_COLOR !== 'undefined') return false

  if (env.TERM === 'dumb') return false

  return stream?.isTTY === true
}

/**
 * Wrap a log message with the ANSI foreground color for a log level.
 *
 * @param {Level} level - Log level used to select the foreground color.
 * @param {string} message - Plain text message to colorize.
 * @returns {string} Message wrapped in ANSI color escape sequences.
 *
 * @example
 * ```ts
 * import { colorfy } from '@faasjs/node-utils'
 *
 * console.log(colorfy('warn', 'Low disk space'))
 * ```
 */
export function colorfy(level: Level, message: string): string {
  return `\u001b[0${LevelColor[level]}m${message}\u001b[39m`
}
