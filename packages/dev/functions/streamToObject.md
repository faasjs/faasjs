[@faasjs/dev](../README.md) / streamToObject

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
