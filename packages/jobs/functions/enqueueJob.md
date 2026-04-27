[@faasjs/jobs](../README.md) / enqueueJob

# Function: enqueueJob()

> **enqueueJob**(`jobPath`, `params?`, `options?`): `Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>

Enqueue a pending job by its `.job.ts` path-derived identifier.

## Parameters

### jobPath

`string`

### params?

`unknown` = `{}`

### options?

[`EnqueueJobOptions`](../type-aliases/EnqueueJobOptions.md) = `{}`

## Returns

`Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>
