[@faasjs/jobs](../README.md) / enqueueJob

# Function: enqueueJob()

> **enqueueJob**(`jobPath`, `params?`, `options?`): `Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>

Enqueue a pending job by its `.job.ts` path-derived identifier.

## Parameters

### jobPath

`string`

The job path identifier derived from the `.job.ts` file location.

### params?

`unknown` = `{}`

The parameters to pass to the job handler.

### options?

[`EnqueueJobOptions`](../type-aliases/EnqueueJobOptions.md) = `{}`

Enqueue options including queue, priority, run time, and idempotency.

## Returns

`Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>

The persisted job record.

## Examples

```ts
await enqueueJob('jobs/users/sync', { userId: 'u_123' })
```

```ts
await enqueueJob(
  'jobs/reports/daily',
  {},
  {
    queue: 'reports',
    priority: 10,
    idempotencyKey: 'report-2025-01-01',
  },
)
```
