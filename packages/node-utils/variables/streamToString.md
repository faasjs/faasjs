[@faasjs/node-utils](../README.md) / streamToString

# Variable: streamToString

> `const` **streamToString**: (`stream`) => `Promise`\<`string`\> = `streamToText`

Alias of [streamToText](../functions/streamToText.md).

Convert ReadableStream to text.

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
