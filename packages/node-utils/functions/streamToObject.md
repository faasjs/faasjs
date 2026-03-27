[@faasjs/node-utils](../README.md) / streamToObject

# Function: streamToObject()

> **streamToObject**\<`T`\>(`stream`): `Promise`\<`T`\>

Convert ReadableStream to object.

## Type Parameters

### T

`T` = `any`

## Parameters

### stream

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Readable stream to decode as JSON.

## Returns

`Promise`\<`T`\>

Parsed JSON object from the stream body.

## Throws

If stream is not a ReadableStream instance.

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
