/**
 * Assigns a name to a given function handler, which will be displayed in logs and error messages.
 *
 * @template T - The type of the function handler.
 * @param {string} name - The name to assign to the function handler.
 * @param {T} handler - The function handler to which the name will be assigned.
 * @returns {T} - The original function handler with the assigned name.
 *
 * @example
 * ```ts
 * import { nameFunc } from '@faasjs/func'
 *
 * const handler = nameFunc('myHandler', () => {
 *  return 'Hello World'
 * })
 *
 * console.log(handler.name) // => 'myHandler'
 * ```
 */
export function nameFunc<T extends (...args: any[]) => any>(
  name: string,
  handler: T
): T {
  Object.defineProperty(handler, 'name', { value: name })
  return handler
}
