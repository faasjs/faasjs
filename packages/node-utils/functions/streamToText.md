[@faasjs/node-utils](../README.md) / streamToText

# Function: streamToText()

> **streamToText**(`stream`): `Promise`\<`string`\>

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
