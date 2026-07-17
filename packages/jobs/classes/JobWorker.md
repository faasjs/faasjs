[@faasjs/jobs](../README.md) / JobWorker

# Class: JobWorker

Long-running background worker that polls the database for pending jobs,
claims them, executes their handlers, and updates their status.

Supports configurable concurrency, polling interval, and lease duration.
Failed jobs are retried according to their retry strategy until
max attempts are reached. Expired leases are reclaimed only while attempts
remain; an expired lease at the attempt limit is marked failed.
Handler errors are persisted to the job row instead of being thrown from `poll()`.

## Example

```ts
const worker = new JobWorker(registry, {
  concurrency: 5,
  pollInterval: 2000,
})
worker.start()
```

## Constructors

### Constructor

> **new JobWorker**(`jobs`, `options?`): `JobWorker`

#### Parameters

##### jobs

[`JobRegistry`](../type-aliases/JobRegistry.md)

##### options?

[`JobWorkerOptions`](../type-aliases/JobWorkerOptions.md) = `{}`

#### Returns

`JobWorker`

## Methods

### poll()

> **poll**(): `Promise`\<`number`\>

Execute one polling cycle: claim up to `concurrency` pending jobs
and run their handlers. No-op if a poll is already in progress.
Handler failures are recorded in PostgreSQL and retried or marked failed.

#### Returns

`Promise`\<`number`\>

The number of jobs processed in this cycle.

### start()

> **start**(): `this`

Start the worker's polling loop. No-op if already active.

#### Returns

`this`

The worker instance (for chaining).

### stop()

> **stop**(): `Promise`\<`void`\>

Stop the polling loop. Waits for the current poll to complete
before resolving.

#### Returns

`Promise`\<`void`\>

## Properties

### concurrency

> `readonly` **concurrency**: `number`

Maximum number of jobs claimed in each poll.

### jobs

> `readonly` **jobs**: [`JobRegistry`](../type-aliases/JobRegistry.md)

Loaded job registry keyed by job path.

### leaseSeconds

> `readonly` **leaseSeconds**: `number`

Lease duration in seconds before a running job can be reclaimed.

### logger

> `readonly` **logger**: `Logger`

Worker logger.

### pollInterval

> `readonly` **pollInterval**: `number`

Milliseconds between automatic poll ticks.

### queue

> `readonly` **queue**: `string`

Queue name this worker claims from.

### workerId

> `readonly` **workerId**: `string`

Unique worker id written to claimed rows.
