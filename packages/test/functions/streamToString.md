[@faasjs/test](../README.md) / streamToString

# Function: streamToString()

> **streamToString**(`stream`): `Promise`\<`string`\>

Convert ReadableStream to string

## Parameters

### stream

`ReadableStream`\<`Uint8Array`\<`ArrayBufferLike`\>\>

{ReadableStream<Uint8Array>} The stream to convert

## Returns

`Promise`\<`string`\>

The string content of stream

## Throws

If stream is not a ReadableStream instance
