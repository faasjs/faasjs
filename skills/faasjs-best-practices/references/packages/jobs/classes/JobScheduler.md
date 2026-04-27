[@faasjs/jobs](../README.md) / JobScheduler

# Class: JobScheduler

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

#### Returns

`this`

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### tick()

> **tick**(`now?`): `Promise`\<`number`\>

#### Parameters

##### now?

`Date` = `...`

#### Returns

`Promise`\<`number`\>

## Properties

### jobs

> `readonly` **jobs**: [`JobRegistry`](../type-aliases/JobRegistry.md)

### logger

> `readonly` **logger**: `Logger`

### pollInterval

> `readonly` **pollInterval**: `number`

### schedulerId

> `readonly` **schedulerId**: `string`
