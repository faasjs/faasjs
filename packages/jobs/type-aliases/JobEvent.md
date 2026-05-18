[@faasjs/jobs](../README.md) / JobEvent

# Type Alias: JobEvent\<TSchema\>

> **JobEvent**\<`TSchema`\> = `object`

Runtime event passed to the underlying job function.

## Type Parameters

### TSchema

`TSchema` *extends* `ZodType` \| `undefined` = `undefined`

## Properties

### attempt?

> `optional` **attempt?**: `number`

Current execution attempt. Defaults to `1` when omitted.

### job?

> `optional` **job?**: `Partial`\<[`JobRecord`](JobRecord.md)\>

Job metadata. Defaults are filled when omitted, which keeps direct job tests small.

### params?

> `optional` **params?**: `TSchema` *extends* `ZodType` ? `input`\<`TSchema`\> : `Record`\<`string`, `any`\>
