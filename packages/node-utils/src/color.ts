import type { Level } from './logger'

/**
 * ANSI color codes used by the built-in logger formatter.
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
 */
export const LevelColor = {
  debug: Color.GRAY,
  info: Color.GREEN,
  warn: Color.ORANGE,
  error: Color.RED,
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
