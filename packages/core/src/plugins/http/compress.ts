import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'

export function createCompressedStream(
  body: string,
  encoding: 'br' | 'gzip' | 'deflate',
): ReadableStream<Uint8Array> {
  const compressStream =
    encoding === 'br'
      ? createBrotliCompress()
      : encoding === 'gzip'
        ? createGzip()
        : createDeflate()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const compressed = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = []

          compressStream.on('data', (chunk: Buffer) => chunks.push(chunk))
          compressStream.on('end', () => resolve(Buffer.concat(chunks)))
          compressStream.on('error', reject)

          compressStream.write(Buffer.from(body))
          compressStream.end()
        })

        const chunkSize = 16 * 1024
        for (let i = 0; i < compressed.length; i += chunkSize) {
          controller.enqueue(compressed.subarray(i, i + chunkSize))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
