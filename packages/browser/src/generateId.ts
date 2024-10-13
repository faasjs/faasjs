/**
 * Generate random id with prefix
 *
 * Note: The random part is **18 characters long**.
 *
 * @param prefix prefix of id
 *
 * @example
 * ```ts
 * generateId('prefix-') // prefix-1z3b4c5d6e
 * ```
 */
export function generateId(prefix?: string) {
  return `${prefix || ''}${Date.now().toString(36).padStart(8, '0')}${Math.random()
    .toString(36)
    .substring(2, 12)
    .padEnd(10, '0')}`
}
