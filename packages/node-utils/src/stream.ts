/**
 * Read a byte stream into a UTF-8 string.
 *
 * @param {ReadableStream<Uint8Array>} stream - Readable stream to decode as text.
 * @returns {Promise<string>} Stream contents as a UTF-8 string.
 * @throws {TypeError} If stream is not a ReadableStream instance.
 *
 * @example
 * ```ts
 * import { streamToText } from '@faasjs/node-utils'
 *
 * const stream = new ReadableStream<Uint8Array>({
 *   start(controller) {
 *     controller.enqueue(new TextEncoder().encode('hello'))
 *     controller.close()
 *   },
 * })
 *
 * await streamToText(stream) // 'hello'
 * ```
 */
export async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).text()
}

/**
 * Parse a JSON value from a byte stream.
 *
 * @template T - Parsed JSON value type expected from the stream.
 * @param {ReadableStream<Uint8Array>} stream - Readable stream to decode as JSON.
 * @returns {Promise<T>} Parsed JSON value from the stream body.
 * @throws {TypeError} If stream is not a ReadableStream instance.
 * @throws {SyntaxError} If the stream body is not valid JSON.
 *
 * @example
 * ```ts
 * import { streamToObject } from '@faasjs/node-utils'
 *
 * const stream = new ReadableStream<Uint8Array>({
 *   start(controller) {
 *     controller.enqueue(new TextEncoder().encode('{\"ok\":true}'))
 *     controller.close()
 *   },
 * })
 *
 * await streamToObject(stream) // { ok: true }
 * ```
 */
export async function streamToObject<T = any>(stream: ReadableStream<Uint8Array>): Promise<T> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).json() as Promise<T>
}
