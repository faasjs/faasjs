[@faasjs/node-utils](../README.md) / stringToStream

# Function: stringToStream()

> **stringToStream**(`text`): `ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Encode a string into a UTF-8 byte stream.

## Parameters

### text

`string`

Text to encode.

## Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Readable stream containing the encoded text.

## Example

```ts
import { stringToStream } from '@faasjs/node-utils'

const stream = stringToStream('hello')
```
