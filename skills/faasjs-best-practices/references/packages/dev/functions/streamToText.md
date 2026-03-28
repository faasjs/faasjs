[@faasjs/dev](../README.md) / streamToText

# Function: streamToText()

> **streamToText**(`stream`): `Promise`\<`string`\>

Read a byte stream into a UTF-8 string.

## Parameters

### stream

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Readable stream to decode as text.

## Returns

`Promise`\<`string`\>

Stream contents as a UTF-8 string.

## Throws

If stream is not a ReadableStream instance.

## Example

```ts
import { streamToText } from '@faasjs/node-utils'

const stream = new ReadableStream<Uint8Array>({
  start(controller) {
    controller.enqueue(new TextEncoder().encode('hello'))
    controller.close()
  },
})

await streamToText(stream) // 'hello'
```
