[@faasjs/cloud_function](../README.md) / CloudFunction

# Class: CloudFunction

## Implements

- `Plugin`

## Constructors

### new CloudFunction(config)

> **new CloudFunction**(`config`?): [`CloudFunction`](CloudFunction.md)

创建云函数配置

#### Parameters

• **config?**: [`CloudFunctionConfig`](../type-aliases/CloudFunctionConfig.md)

\{object\} 配置项，这些配置将强制覆盖默认配置

#### Returns

[`CloudFunction`](CloudFunction.md)

## Properties

### config

> **config**: `Object`

#### Index signature

 \[`key`: `string`\]: `any`

#### Type declaration

##### memorySize?

> **memorySize**?: `number`

##### name?

> **name**?: `string`

##### timeout?

> **timeout**?: `number`

##### triggers?

> **triggers**?: `Object`[]

### context

> **context**: `any`

### event

> **event**: `any`

### name

> **`readonly`** **name**: `string` = `Name`

#### Implementation of

`Plugin.name`

### type

> **`readonly`** **type**: `string` = `Name`

#### Implementation of

`Plugin.type`

## Methods

### invoke()

> **invoke**\<`TData`\>(`name`, `data`?, `options`?): `Promise`\<`void`\>

异步触发云函数

#### Type parameters

• **TData** = `any`

#### Parameters

• **name**: `string`

\{string\} 云函数文件名或云函数名

• **data?**: `TData`

\{any\} 参数

• **options?**: `Record`\<`string`, `any`\>

\{object\} 额外配置项

#### Returns

`Promise`\<`void`\>

### invokeSync()

> **invokeSync**\<`TResult`, `TData`\>(`name`, `data`?, `options`?): `Promise`\<`TResult`\>

同步调用云函数

#### Type parameters

• **TResult** = `any`

• **TData** = `any`

#### Parameters

• **name**: `string`

\{string\} 云函数文件名或云函数名

• **data?**: `TData`

\{any\} 参数

• **options?**: `Record`\<`string`, `any`\>

\{object\} 额外配置项

#### Returns

`Promise`\<`TResult`\>

### onDeploy()

> **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `DeployData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onDeploy`

### onInvoke()

> **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `InvokeData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onInvoke`

### onMount()

> **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

• **data**: `MountData`

• **next**: `Next`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`Plugin.onMount`
