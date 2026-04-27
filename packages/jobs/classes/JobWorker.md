[@faasjs/jobs](../README.md) / JobWorker

# Class: JobWorker

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

#### Returns

`Promise`\<`number`\>

### start()

> **start**(): `this`

#### Returns

`this`

### stop()

> **stop**(): `Promise`\<`void`\>

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
