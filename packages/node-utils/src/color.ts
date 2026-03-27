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
 * Default ANSI color mapping for each log level.
 */
export const LevelColor = {
  debug: Color.GRAY,
  info: Color.GREEN,
  warn: Color.ORANGE,
  error: Color.RED,
}

/**
 * Apply ANSI color codes to a message based on the log level.
 *
 * @param level - The log level to determine the color.
 * @param message - The message to be colorized.
 * @returns The colorized message string.
 */
export function colorfy(level: Level, message: string): string {
  return `\u001b[0${LevelColor[level]}m${message}\u001b[39m`
}
