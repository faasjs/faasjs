/**
 * # @faasjs/utils
 *
 * FaasJS cross-runtime utility helpers.
 *
 * The package bundles pure utilities that work across Node.js, browsers, and edge runtimes,
 * including deep merge helpers and stream conversion helpers.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/utils
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { deepMerge, streamToString } from '@faasjs/utils'
 *
 * const merged = deepMerge({ a: 1 }, { b: 2 })
 * const text = await streamToString(
 *   new ReadableStream<Uint8Array>({
 *     start(controller) {
 *       controller.enqueue(new TextEncoder().encode('hello'))
 *       controller.close()
 *     },
 *   }),
 * )
 *
 * console.log(merged, text)
 * ```
 */

export { deepMerge } from './deep-merge'
export { streamToString, stringToStream, objectToStream, streamToObject } from './stream'
export { z, isObjectRecord } from './zod'
export type { Z, ZodType, ZodError, input, output } from './zod'
export { parseJson, parseObjectFromJson, parseArrayFromJson } from './json'
