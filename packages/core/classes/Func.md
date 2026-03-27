[@faasjs/core](../README.md) / Func

# Class: Func\<TEvent, TContext, TResult\>

Core executable unit used by FaasJS runtimes and helpers.

A Func composes lifecycle plugins, exposes a runtime handler via
[Func.export](#export), and keeps function configuration available across mounts
and invokes.

## Example

```ts
import { Func } from '@faasjs/core'

const func = new Func({
  async handler({ event }) {
    return { echo: event }
  },
})

const result = await func.export().handler({ name: 'FaasJS' })
```

## Type Parameters

### TEvent

`TEvent` = `any`

Runtime event type.

### TContext

`TContext` = `any`

Runtime context type.

### TResult

`TResult` = `any`

Async result type produced by the handler.

## Indexable

> \[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new Func**\<`TEvent`, `TContext`, `TResult`\>(`config`): `Func`\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function.

#### Parameters

##### config

[`FuncConfig`](../type-aliases/FuncConfig.md)\<`TEvent`, `TContext`\>

Plugins and optional business handler used to configure the function.

#### Returns

`Func`\<`TEvent`, `TContext`, `TResult`\>

## Methods

### export()

> **export**(): `object`

Export the function.

#### Returns

`object`

##### handler

> **handler**: [`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>

### invoke()

> **invoke**(`data`): `Promise`\<`void`\>

Invoke the function.

#### Parameters

##### data

[`InvokeData`](../type-aliases/InvokeData.md)\<`TEvent`, `TContext`, `TResult`\>

Invocation state mutated by plugins and the final handler.

#### Returns

`Promise`\<`void`\>

### mount()

> **mount**(`data?`): `Promise`\<`void`\>

First time mount the function.

#### Parameters

##### data?

Optional initial event, context, config, and logger used during mount.

###### config?

[`Config`](../type-aliases/Config.md)

###### context

`TContext`

###### event

`TEvent`

###### logger?

`Logger`

#### Returns

`Promise`\<`void`\>

## Properties

### config

> **config**: [`Config`](../type-aliases/Config.md)

Mutable runtime configuration used by the function.

### filename?

> `optional` **filename?**: `string`

Resolved source filename inferred from the constructor call stack.

### handler?

> `optional` **handler?**: [`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

Final business handler invoked after plugins finish.

### mounted

> **mounted**: `boolean` = `false`

Indicates whether mount hooks have already run.

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

Ordered plugin instances attached to this function.
