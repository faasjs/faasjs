[@faasjs/jobs](../README.md) / enqueueJob

# Function: enqueueJob()

> **enqueueJob**(`jobPath`, `params?`, `options?`): `Promise`\<[`JobRecord`](../type-aliases/JobRecord.md)\>

Enqueue a pending job by its `.job.ts` path-derived identifier.

The jobs table is initialized automatically. When `idempotencyKey` is supplied
and a matching row already exists, the existing row is returned unchanged.

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

## Throws

When queue, job path, priority, max attempts, or database writes are invalid.

## Examples

```ts
await enqueueJob('features/users/jobs/sync', { userId: 'u_123' })
```

```ts
await enqueueJob(
  'features/reports/jobs/daily',
  {},
  {
    queue: 'reports',
    priority: 10,
    idempotencyKey: 'report-2025-01-01',
  },
)
```
