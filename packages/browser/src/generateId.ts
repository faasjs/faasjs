/**
 * Generate random id
 *
 * @param prefix prefix of id
 */
export function generateId(prefix?: string) {
  return `${prefix || ''}${Date.now().toString(36)}${Math.random()
    .toString(36)
    .substring(2, 12)}`
}
