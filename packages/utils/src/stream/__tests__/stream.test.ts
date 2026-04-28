import { describe, expect, it } from 'vitest'

import { objectToStream, streamToObject, streamToString, stringToStream } from '../../stream'

describe('stream helpers', () => {
  it('streamToString should read text', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('hello'))
        controller.close()
      },
    })

    await expect(streamToString(stream)).resolves.toBe('hello')
  })

  it('stringToStream should write text', async () => {
    await expect(streamToString(stringToStream('hello'))).resolves.toBe('hello')
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

  it('objectToStream should write json', async () => {
    await expect(streamToObject(objectToStream({ ok: true }))).resolves.toEqual({ ok: true })
  })

  it('should throw when stream is invalid', async () => {
    await expect(streamToString({} as any)).rejects.toThrow('ReadableStream instance')
    await expect(streamToObject({} as any)).rejects.toThrow('ReadableStream instance')
  })
})
