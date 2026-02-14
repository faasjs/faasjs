/**
 * Convert ReadableStream to text.
 *
 * @throws {TypeError} If stream is not a ReadableStream instance.
 */
export async function streamToText(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).text()
}

/**
 * Convert ReadableStream to object.
 *
 * @throws {TypeError} If stream is not a ReadableStream instance.
 */
export async function streamToObject<T = any>(
  stream: ReadableStream<Uint8Array>
): Promise<T> {
  if (!(stream instanceof ReadableStream))
    throw new TypeError('stream must be a ReadableStream instance')

  return new Response(stream).json() as Promise<T>
}

export const streamToString = streamToText
