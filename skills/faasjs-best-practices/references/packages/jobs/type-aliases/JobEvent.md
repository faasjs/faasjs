[@faasjs/jobs](../README.md) / JobEvent

# Type Alias: JobEvent\<TSchema\>

> **JobEvent**\<`TSchema`\> = `object`

Runtime event passed to the underlying job function.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

## Properties

### attempt

> **attempt**: `number`

### client

> **client**: `Client`

### job

> **job**: [`JobRecord`](JobRecord.md)

### params?

> `optional` **params?**: `SchemaOutput`\<`TSchema`, `Record`\<`string`, `any`\>\>
