[@faasjs/node-utils](../README.md) / streamToObject

# Function: streamToObject()

> **streamToObject**\<`T`\>(`stream`): `Promise`\<`T`\>

Parse a JSON value from a byte stream.

## Type Parameters

### T

`T` = `any`

Parsed JSON value type expected from the stream.

## Parameters

### stream

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Readable stream to decode as JSON.

## Returns

`Promise`\<`T`\>

Parsed JSON value from the stream body.

## Throws

If stream is not a ReadableStream instance.

## Throws

If the stream body is not valid JSON.

## Example

```ts
import { streamToObject } from '@faasjs/node-utils'

const stream = new ReadableStream<Uint8Array>({
  start(controller) {
    controller.enqueue(new TextEncoder().encode('{\"ok\":true}'))
    controller.close()
  },
})

await streamToObject(stream) // { ok: true }
```
