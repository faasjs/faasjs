[@faasjs/test](../README.md) / Func

# Class: Func\<TEvent, TContext, TResult\>

## Type parameters

• **TEvent** = `any`

• **TContext** = `any`

• **TResult** = `any`

## Indexable

 \[`key`: `string`\]: `any`

## Constructors

### new Func(config)

> **new Func**\<`TEvent`, `TContext`, `TResult`\>(`config`): [`Func`](Func.md)\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function

#### Parameters

• **config**: [`FuncConfig`](../type-aliases/FuncConfig.md)\<`TEvent`, `TContext`, `any`\>

\{object\} config

#### Returns

[`Func`](Func.md)\<`TEvent`, `TContext`, `TResult`\>

## Properties

### config

> **config**: [`Config`](../type-aliases/Config.md)

### filename?

> **filename**?: `string`

### handler?

> **handler**?: [`Handler`](../type-aliases/Handler.md)\<`TEvent`, `TContext`, `TResult`\>

### mounted

> **mounted**: `boolean`

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

## Methods

### deploy()

> **deploy**(`data`): `any`

Deploy the function

#### Parameters

• **data**: [`DeployData`](../type-aliases/DeployData.md)

\{object\} data

#### Returns

`any`

### export()

> **export**(): `Object`

Export the function

#### Returns

`Object`

> ##### handler
>
> > **handler**: [`ExportedHandler`](../type-aliases/ExportedHandler.md)\<`TEvent`, `TContext`, `TResult`\>
>

### invoke()

> **invoke**(`data`): `Promise`\<`void`\>

Invoke the function

#### Parameters

• **data**: [`InvokeData`](../type-aliases/InvokeData.md)\<`TEvent`, `TContext`, `TResult`\>

\{object\} data

#### Returns

`Promise`\<`void`\>

### mount()

> **mount**(`data`): `Promise`\<`void`\>

First time mount the function

#### Parameters

• **data**: `Object`

• **data\.config?**: [`Config`](../type-aliases/Config.md)

• **data\.context**: `TContext`

• **data\.event**: `TEvent`

• **data\.logger?**: `Logger`

#### Returns

`Promise`\<`void`\>
