/**
 * Convert ReadableStream to text.
 *
 * @param stream - Readable stream to decode as text.
 * @returns Stream contents as a UTF-8 string.
 * @throws {TypeError} If stream is not a ReadableStream instance.
 */
export async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).text()
}

/**
 * Convert ReadableStream to object.
 *
 * @param stream - Readable stream to decode as JSON.
 * @returns Parsed JSON object from the stream body.
 * @throws {TypeError} If stream is not a ReadableStream instance.
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
