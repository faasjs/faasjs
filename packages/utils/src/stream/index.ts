/**
 * Read a byte stream into a UTF-8 string.
 *
 * @param {ReadableStream<Uint8Array>} stream - Readable stream to decode as text.
 * @returns {Promise<string>} Stream contents as a UTF-8 string.
 * @throws {TypeError} If stream is not a ReadableStream instance.
 *
 * @example
 * ```ts
 * import { streamToString } from '@faasjs/utils'
 *
 * const stream = new ReadableStream<Uint8Array>({
 *   start(controller) {
 *     controller.enqueue(new TextEncoder().encode('hello'))
 *     controller.close()
 *   },
 * })
 *
 * await streamToString(stream) // 'hello'
 * ```
 */
export async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).text()
}

/**
 * Encode a string into a UTF-8 byte stream.
 *
 * @param {string} text - Text to encode.
 * @returns {ReadableStream<Uint8Array>} Readable stream containing the encoded text.
 *
 * @example
 * ```ts
 * import { stringToStream } from '@faasjs/utils'
 *
 * const stream = stringToStream('hello')
 * ```
 */
export function stringToStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
}

/**
 * Encode a JSON-serializable value into a UTF-8 byte stream.
 *
 * @template T - JSON-serializable value type to encode.
 * @param {T} object - Value to serialize as JSON.
 * @returns {ReadableStream<Uint8Array>} Readable stream containing the JSON payload.
 * @throws {TypeError} If the value cannot be serialized to JSON.
 *
 * @example
 * ```ts
 * import { objectToStream } from '@faasjs/utils'
 *
 * const stream = objectToStream({ ok: true })
 * ```
 */
export function objectToStream<T = any>(object: T): ReadableStream<Uint8Array> {
  return stringToStream(JSON.stringify(object))
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
 * import { streamToObject } from '@faasjs/utils'
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
