[@faasjs/jobs](../README.md) / Job

# Class: Job\<TSchema, TContext, TResult\>

Executable job definition returned by [defineJob](../functions/defineJob.md).

## Extends

- `Func`\<[`JobEvent`](../type-aliases/JobEvent.md)\<`TSchema`\>, `TContext`, `TResult`\>

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType` \| `undefined` = `undefined`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Indexable

> \[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new Job**\<`TSchema`, `TContext`, `TResult`\>(`options`): `Job`\<`TSchema`, `TContext`, `TResult`\>

#### Parameters

##### options

[`DefineJobOptions`](../type-aliases/DefineJobOptions.md)\<`TSchema`, `TContext`, `TResult`\>

#### Returns

`Job`\<`TSchema`, `TContext`, `TResult`\>

#### Overrides

`Func<JobEvent<TSchema>, TContext, TResult>.constructor`

## Methods

### export()

> **export**(): `object`

Build the exported handler wrapper for the function.

#### Returns

`object`

Object containing the exported handler.

##### handler

> **handler**: `ExportedHandler`\<[`JobEvent`](../type-aliases/JobEvent.md)\<`TSchema`\>, `TContext`, `TResult`\>

#### Inherited from

`Func.export`

### invoke()

> **invoke**(`data`): `Promise`\<`void`\>

Invoke the function.

#### Parameters

##### data

`InvokeData`\<[`JobEvent`](../type-aliases/JobEvent.md)\<`TSchema`\>, `TContext`, `TResult`\>

Invocation state mutated by plugins and the final handler.

#### Returns

`Promise`\<`void`\>

Promise that resolves after invoke hooks complete.

#### Inherited from

`Func.invoke`

### mount()

> **mount**(`data?`): `Promise`\<`void`\>

First time mount the function.

#### Parameters

##### data?

Optional initial event, context, config, and logger used during mount.

###### config?

`Config`

Function config override used during mount.

###### context

`TContext`

Initial context value passed through mount hooks.

###### event

[`JobEvent`](../type-aliases/JobEvent.md)

Initial event value passed through mount hooks.

###### logger?

`Logger`

Logger override used during mount.

#### Returns

`Promise`\<`void`\>

Promise that resolves after mount hooks complete.

#### Inherited from

`Func.mount`

## Properties

### \_\_faasjsJob

> `readonly` **\_\_faasjsJob**: `true` = `true`

### config

> **config**: `Config`

Mutable runtime configuration used by the function.

#### Inherited from

`Func.config`

### cron

> `readonly` **cron**: [`JobCron`](../type-aliases/JobCron.md)\<`SchemaOutput`\<`TSchema`, `Record`\<`string`, `never`\>\>\>[]

### filename?

> `optional` **filename?**: `string`

Resolved source filename inferred from the constructor call stack.

#### Inherited from

`Func.filename`

### handler?

> `optional` **handler?**: `Handler`\<[`JobEvent`](../type-aliases/JobEvent.md)\<`TSchema`\>, `TContext`, `TResult`\>

Final business handler invoked after plugins finish.

#### Inherited from

`Func.handler`

### maxAttempts

> `readonly` **maxAttempts**: `number`

### mounted

> **mounted**: `boolean` = `false`

Indicates whether mount hooks have already run.

#### Inherited from

`Func.mounted`

### plugins

> **plugins**: `Plugin`[]

Ordered plugin instances attached to this function.

#### Inherited from

`Func.plugins`

### queue

> `readonly` **queue**: `string`

### retry

> `readonly` **retry**: [`JobRetry`](../type-aliases/JobRetry.md) \| `undefined`

### schema

> `readonly` **schema**: `TSchema` \| `undefined`
