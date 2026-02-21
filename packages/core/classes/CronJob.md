[@faasjs/core](../README.md) / CronJob

# Class: CronJob

Simple cron job scheduler with 5-field cron expression support.

## Constructors

### Constructor

> **new CronJob**(`options`): `CronJob`

#### Parameters

##### options

[`CronJobOptions`](../type-aliases/CronJobOptions.md)

#### Returns

`CronJob`

## Methods

### start()

> **start**(): `void`

#### Returns

`void`

### stop()

> **stop**(): `void`

#### Returns

`void`

## Properties

### expression

> `readonly` **expression**: `string`

### handler

> `readonly` **handler**: [`CronJobHandler`](../type-aliases/CronJobHandler.md)

### name

> `readonly` **name**: `string`
