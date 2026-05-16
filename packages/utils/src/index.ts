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

export * from './deep_merge'
export * from './stream'
export * from './zod'
