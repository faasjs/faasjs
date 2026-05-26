/**
 * Convert a value to error message.
 *
 * @param {unknown} error
 *
 * @example
 * ```ts
 * import { toErrorMessage } from '@faasjs/utils'
 *
 * toErrorMessage(Error('message')) //=> 'message'
 */
export const toErrorMessage = (error: unknown, fallback: string = 'Unknown error'): string => {
  if (typeof error === 'string') return error.trim() || fallback

  if (typeof error === 'object' && error !== null && 'message' in error) {
    if (typeof error.message === 'string') return error.message.trim() || fallback

    return String(error.message).trim() || fallback
  }

  return fallback
}
