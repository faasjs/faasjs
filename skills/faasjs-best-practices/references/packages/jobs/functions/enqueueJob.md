[@faasjs/jobs](../README.md) / enqueueJob

# Function: enqueueJob()

> **enqueueJob**(`jobPath`, `payload?`, `options?`): `Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>

Enqueue a pending job by its `.job.ts` path-derived identifier.

## Parameters

### jobPath

`string`

### payload?

`unknown` = `{}`

### options?

[`EnqueueJobOptions`](../type-aliases/EnqueueJobOptions.md) = `{}`

## Returns

`Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>
