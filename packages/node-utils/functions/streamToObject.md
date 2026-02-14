[@faasjs/node-utils](../README.md) / streamToObject

# Function: streamToObject()

> **streamToObject**\<`T`\>(`stream`): `Promise`\<`T`\>

Convert ReadableStream to object.

## Type Parameters

### T

`T` = `any`

## Parameters

### stream

`ReadableStream`\<`Uint8Array`\>

## Returns

`Promise`\<`T`\>

## Throws

- Throws `TypeError` if stream is not a `ReadableStream` instance.
