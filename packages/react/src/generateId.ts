/**
 * Generate a random identifier with an optional prefix.
 *
 * @param prefix - Prefix prepended to the generated identifier.
 * @param length - Length of the generated identifier excluding `prefix`. Must be between `8` and `18`.
 * @returns Generated identifier string.
 * @throws {Error} When `length` is outside the supported `8` to `18` range.
 *
 * @example
 * ```ts
 * const id = generateId('prefix-')
 *
 * id.startsWith('prefix-') // true
 * ```
 */
export function generateId(prefix = '', length = 18): string {
  if (length < 8 || length > 18) throw new Error('Length must be 8 ~ 18')

  return `${prefix}${Date.now().toString(36).padStart(8, '0')}${Math.random()
    .toString(36)
    .substring(2, length - 6)
    .padEnd(length - 8, '0')}`
}
