import type { Level } from '../logger'

type ColorizeEnv = Record<string, string | undefined>

type ColorizeStream = {
  isTTY?: boolean
}

/**
 * ANSI foreground color codes used by {@link colorize} and the built-in logger output.
 *
 * `Color.DEFAULT` resets the foreground color back to the terminal default.
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
 * Default ANSI color mapping used by {@link Logger} for each log level when colorized output is enabled.
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
 * `FORCE_COLOR` forces colors on or off, `NO_COLOR` disables colors, `TERM=dumb`
 * disables colors, and regular local output only enables colors when the target
 * is a TTY. When `env` is omitted, colorized output is disabled.
 *
 * @param {ColorizeStream} [stream] - Output target used by the logger.
 * @param {ColorizeEnv} [env] - Environment variables used to override detection.
 * @returns {boolean} `true` when ANSI colors should be emitted.
 *
 * @example
 * ```ts
 * const enabled = supportsColorizeOutput({ isTTY: true }, process.env)
 * ```
 */
export function supportsColorizeOutput(stream?: ColorizeStream, env?: ColorizeEnv): boolean {
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
 * This low-level helper always emits ANSI escape sequences; use {@link Logger}
 * when you want environment-aware color decisions.
 *
 * @param {Level} level - Log level used to select the foreground color.
 * @param {string} message - Plain text message to colorize.
 * @returns {string} Message wrapped in ANSI color escape sequences.
 *
 * @example
 * ```ts
 * import { colorize } from '@faasjs/node-utils'
 *
 * console.log(colorize('warn', 'Low disk space'))
 * ```
 */
export function colorize(level: Level, message: string): string {
  return `\u001b[0${LevelColor[level]}m${message}\u001b[39m`
}
