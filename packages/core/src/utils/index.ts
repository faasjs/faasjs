/**
 * Assign a stable name to a function for logs and stack traces.
 *
 * @template T - Function type to rename.
 * @param {string} name - Name assigned to `handler.name`.
 * @param {T} handler - Function to rename.
 * @returns {T} The same handler with an updated `name` property.
 *
 * @example
 * ```ts
 * import { nameFunc } from '@faasjs/core'
 *
 * const handler = nameFunc('myHandler', () => 'Hello World')
 *
 * console.log(handler.name) // => 'myHandler'
 * ```
 */
export function nameFunc<T extends (...args: any[]) => any>(name: string, handler: T): T {
  Object.defineProperty(handler, 'name', { value: name })
  return handler
}
