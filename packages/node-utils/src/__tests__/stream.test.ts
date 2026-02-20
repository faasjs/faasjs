import { describe, expect, it } from 'vitest'
import { streamToObject, streamToString, streamToText } from '../stream'

describe('stream helpers', () => {
  it('streamToText should read text', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('hello'))
        controller.close()
      },
    })

    await expect(streamToText(stream)).resolves.toBe('hello')
  })

  it('streamToObject should parse json', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"ok":true}'))
        controller.close()
      },
    })

    await expect(streamToObject(stream)).resolves.toEqual({ ok: true })
  })

  it('streamToString should be alias of streamToText', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('alias'))
        controller.close()
      },
    })

    await expect(streamToString(stream)).resolves.toBe('alias')
  })

  it('should throw when stream is invalid', async () => {
    await expect(streamToText({} as any)).rejects.toThrow('ReadableStream instance')
    await expect(streamToObject({} as any)).rejects.toThrow('ReadableStream instance')
  })
})
