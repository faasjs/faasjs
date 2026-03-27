/**
 * Convert ReadableStream to text.
 *
 * @param stream - Readable stream to decode as text.
 * @returns Stream contents as a UTF-8 string.
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
 * Convert ReadableStream to object.
 *
 * @template T - Parsed JSON value type expected from the stream.
 *
 * @param stream - Readable stream to decode as JSON.
 * @returns Parsed JSON object from the stream body.
 * @throws {TypeError} If stream is not a ReadableStream instance.
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

/**
 * Alias of {@link streamToText}.
 */
export const streamToString = streamToText
