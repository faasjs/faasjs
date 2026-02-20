/**
 * Generate random id with prefix
 *
 * @param prefix prefix of id
 * @param length length of id without prefix, range is 8 ~ 18, default is 18
 *
 * @example
 * ```ts
 * generateId('prefix-') // prefix-1z3b4c5d6e
 * ```
 */
export function generateId(prefix = '', length = 18): string {
  if (length < 8 || length > 18) throw new Error('Length must be 8 ~ 18')

  return `${prefix}${Date.now().toString(36).padStart(8, '0')}${Math.random()
    .toString(36)
    .substring(2, length - 6)
    .padEnd(length - 8, '0')}`
}
