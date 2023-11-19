# Class: CloudFunction

## Implements

- `Plugin`

## Table of contents

### Constructors

- [constructor](CloudFunction.md#constructor)

### Properties

- [config](CloudFunction.md#config)
- [context](CloudFunction.md#context)
- [event](CloudFunction.md#event)
- [name](CloudFunction.md#name)
- [type](CloudFunction.md#type)

### Methods

- [invoke](CloudFunction.md#invoke)
- [invokeSync](CloudFunction.md#invokesync)
- [onDeploy](CloudFunction.md#ondeploy)
- [onInvoke](CloudFunction.md#oninvoke)
- [onMount](CloudFunction.md#onmount)

## Constructors

### constructor

• **new CloudFunction**(`config?`): [`CloudFunction`](CloudFunction.md)

创建云函数配置

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`CloudFunctionConfig`](../#cloudfunctionconfig) | {object} 配置项，这些配置将强制覆盖默认配置 |

#### Returns

[`CloudFunction`](CloudFunction.md)

## Properties

### config

• **config**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `memorySize?` | `number` |
| `name?` | `string` |
| `timeout?` | `number` |
| `triggers?` | \{ `name`: `string` ; `type`: `string` ; `value`: `string`  }[] |

___

### context

• **context**: `any`

___

### event

• **event**: `any`

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

## Methods

### invoke

▸ **invoke**\<`TData`\>(`name`, `data?`, `options?`): `Promise`\<`void`\>

异步触发云函数

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | {string} 云函数文件名或云函数名 |
| `data?` | `TData` | {any} 参数 |
| `options?` | `Record`\<`string`, `any`\> | {object} 额外配置项 |

#### Returns

`Promise`\<`void`\>

___

### invokeSync

▸ **invokeSync**\<`TResult`, `TData`\>(`name`, `data?`, `options?`): `Promise`\<`TResult`\>

同步调用云函数

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |
| `TData` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | {string} 云函数文件名或云函数名 |
| `data?` | `TData` | {any} 参数 |
| `options?` | `Record`\<`string`, `any`\> | {object} 额外配置项 |

#### Returns

`Promise`\<`TResult`\>

___

### onDeploy

▸ **onDeploy**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onDeploy

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData` |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onInvoke

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

Plugin.onMount
