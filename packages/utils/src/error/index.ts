/**
 * Convert a value to an error message string.
 *
 * Extracts a message from `Error` instances and error-like objects, or
 * returns the `fallback` when the value cannot be coerced to a useful message.
 *
 * @param {unknown} error - Value to convert (Error, string, or object with `message`).
 * @param {string} [fallback='Unknown error'] - Text returned when no message can be extracted.
 * @returns {string} Extracted or fallback error message.
 *
 * @example
 * ```ts
 * import { toErrorMessage } from '@faasjs/utils'
 *
 * toErrorMessage(Error('something wrong')) // 'something wrong'
 * toErrorMessage('  ') // 'Unknown error'
 * toErrorMessage(null) // 'Unknown error'
 * ```
 */
export const toErrorMessage = (error: unknown, fallback: string = 'Unknown error'): string => {
  if (typeof error === 'string') return error.trim() || fallback

  if (typeof error === 'object' && error !== null && 'message' in error) {
    if (typeof error.message === 'string') return error.message.trim() || fallback

    return String(error.message).trim() || fallback
  }

  return fallback
}
