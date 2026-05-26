[@faasjs/jobs](../README.md) / JobWorker

# Class: JobWorker

Long-running background worker that polls the database for pending jobs,
claims them, executes their handlers, and updates their status.

Supports configurable concurrency, polling interval, and lease duration.
Failed jobs are retried according to their retry strategy until
max attempts are reached.

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

### jobs

> `readonly` **jobs**: [`JobRegistry`](../type-aliases/JobRegistry.md)

### leaseSeconds

> `readonly` **leaseSeconds**: `number`

### logger

> `readonly` **logger**: `Logger`

### pollInterval

> `readonly` **pollInterval**: `number`

### queue

> `readonly` **queue**: `string`

### workerId

> `readonly` **workerId**: `string`
