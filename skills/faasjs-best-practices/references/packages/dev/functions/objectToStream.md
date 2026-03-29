[@faasjs/dev](../README.md) / objectToStream

# Function: objectToStream()

> **objectToStream**\<`T`\>(`object`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Encode a JSON-serializable value into a UTF-8 byte stream.

## Type Parameters

### T

`T` = `any`

JSON-serializable value type to encode.

## Parameters

### object

`T`

Value to serialize as JSON.

## Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Readable stream containing the JSON payload.

## Throws

If the value cannot be serialized to JSON.

## Example

```ts
import { objectToStream } from '@faasjs/utils'

const stream = objectToStream({ ok: true })
```
