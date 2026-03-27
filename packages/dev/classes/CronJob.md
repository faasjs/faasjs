[@faasjs/dev](../README.md) / CronJob

# Class: CronJob

Simple cron job scheduler with 5-field cron expression support.

## Example

```ts
import { CronJob } from '@faasjs/core'

const job = new CronJob({
  expression: '5 * * * *',
  async handler({ logger }) {
    logger.info('run cleanup')
  },
})

job.start()
job.stop()
```

## Accessors

### isStarted

#### Get Signature

> **get** **isStarted**(): `boolean`

Whether the cron job is currently scheduled.

##### Returns

`boolean`

## Constructors

### Constructor

> **new CronJob**(`options`): `CronJob`

Create a cron job from an expression and handler.

#### Parameters

##### options

[`CronJobOptions`](../type-aliases/CronJobOptions.md)

Cron job options including expression, handler, and logger.

#### Returns

`CronJob`

## Methods

### start()

> **start**(): `void`

Start checking the cron expression on minute boundaries.

#### Returns

`void`

### stop()

> **stop**(): `void`

Stop future cron checks for this job.

#### Returns

`void`

## Properties

### expression

> `readonly` **expression**: `string`

Original 5-field cron expression.

### handler

> `readonly` **handler**: [`CronJobHandler`](../type-aliases/CronJobHandler.md)

Callback invoked when the expression matches.

### name

> `readonly` **name**: `string`

Job name used in logs and registry helpers.
