[@faasjs/jobs](../README.md) / JobScheduler

# Class: JobScheduler

Periodic scheduler that iterates over registered job definitions,
evaluates their cron rules, and enqueues matching jobs at the top
of each minute.

Deduplicates cron enqueues by computing a hash of the rule configuration
(job path, expression, timezone, queue, params) and using it as a
conflict key in the database.

## Example

```ts
const scheduler = new JobScheduler(registry, { pollInterval: 60_000 })
scheduler.start()
```

## Constructors

### Constructor

> **new JobScheduler**(`jobs`, `options?`): `JobScheduler`

#### Parameters

##### jobs

[`JobRegistry`](../type-aliases/JobRegistry.md)

##### options?

[`JobSchedulerOptions`](../type-aliases/JobSchedulerOptions.md) = `{}`

#### Returns

`JobScheduler`

## Methods

### start()

> **start**(): `this`

Start the scheduler's cron loop. No-op if already active.

#### Returns

`this`

The scheduler instance (for chaining).

### stop()

> **stop**(): `Promise`\<`void`\>

Stop the scheduler loop. Waits for the current tick to complete
before resolving.

#### Returns

`Promise`\<`void`\>

### tick()

> **tick**(`now?`): `Promise`\<`number`\>

Execute one scheduling tick: evaluate all cron rules against the
current minute and enqueue matching jobs. No-op if a tick is
already in progress.

#### Parameters

##### now?

`Date` = `...`

The reference time (defaults to the current instant).

#### Returns

`Promise`\<`number`\>

The number of jobs enqueued in this tick.

## Properties

### jobs

> `readonly` **jobs**: [`JobRegistry`](../type-aliases/JobRegistry.md)

### logger

> `readonly` **logger**: `Logger`

### pollInterval

> `readonly` **pollInterval**: `number`

### schedulerId

> `readonly` **schedulerId**: `string`
