/**
 * Generate random id
 *
 * @param prefix prefix of id
 */
export function generateId(prefix?: string) {
  return `${prefix || ''}${Date.now().toString(36).padStart(8, '0')}${Math.random()
    .toString(36)
    .substring(2, 12)
    .padEnd(10, '0')}`
}
