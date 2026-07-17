[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / JobScheduler

# Class: JobScheduler

Periodic scheduler that iterates over registered job definitions,
evaluates their cron rules, and enqueues matching jobs at the top
of each minute.
The scheduler only enqueues rows; workers execute handlers.

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

> **stop**(): `Promise`\<`void`>>>>>>\>

Stop the scheduler loop. Waits for the current tick to complete
before resolving.

#### Returns

`Promise`\<`void`\>

### tick()

> **tick**(`now?`): `Promise`\<`number`>>>>>>\>

Execute one scheduling tick: evaluate all cron rules against the
current minute and enqueue matching jobs. No-op if a tick is
already in progress.

#### Parameters

##### now?

`Date` = `...`

The reference time (defaults to the current instant).

#### Returns

`Promise`\<`number`\>

The number of matching cron rules processed in this tick. Existing
deduplicated rows may be returned instead of newly inserted rows.

## Properties

### jobs

> `readonly` **jobs**: [`JobRegistry`](../type-aliases/JobRegistry.md)

Loaded job registry keyed by job path.

### logger

> `readonly` **logger**: `Logger`

Scheduler logger.

### pollInterval

> `readonly` **pollInterval**: `number`

Milliseconds between automatic cron ticks.

### schedulerId

> `readonly` **schedulerId**: `string`

Unique scheduler id used in logs.
