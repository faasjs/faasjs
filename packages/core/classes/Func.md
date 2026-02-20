[@faasjs/core](../README.md) / Func

# Class: Func\<TEvent, TContext, TResult\>

## Type Parameters

### TEvent

`TEvent` = `any`

### TContext

`TContext` = `any`

### TResult

`TResult` = `any`

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### Constructor

> **new Func**\<`TEvent`, `TContext`, `TResult`\>(`config`): `Func`\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function.

#### Parameters

##### config

[`FuncConfig`](../type-aliases/FuncConfig.md)\<`TEvent`, `TContext`\>

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

#### Returns

`Promise`\<`void`\>

### mount()

> **mount**(`data?`): `Promise`\<`void`\>

First time mount the function.

#### Parameters

##### data?

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

### filename?

> `optional` **filename**: `string`

### handler?

> `optional` **handler**: [`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

### mounted

> **mounted**: `boolean` = `false`

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]
