# Class: Func\<TEvent, TContext, TResult\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Constructors

- [constructor](Func.md#constructor)

### Properties

- [config](Func.md#config)
- [filename](Func.md#filename)
- [handler](Func.md#handler)
- [mounted](Func.md#mounted)
- [plugins](Func.md#plugins)

### Methods

- [deploy](Func.md#deploy)
- [export](Func.md#export)
- [invoke](Func.md#invoke)
- [mount](Func.md#mount)

## Constructors

### constructor

• **new Func**\<`TEvent`, `TContext`, `TResult`\>(`config`): [`Func`](Func.md)\<`TEvent`, `TContext`, `TResult`\>

Create a cloud function

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`FuncConfig`](../#funcconfig)\<`TEvent`, `TContext`, `any`\> | {object} config |

#### Returns

[`Func`](Func.md)\<`TEvent`, `TContext`, `TResult`\>

## Properties

### config

• **config**: [`Config`](../#config)

___

### filename

• `Optional` **filename**: `string`

___

### handler

• `Optional` **handler**: [`Handler`](../#handler)\<`TEvent`, `TContext`, `TResult`\>

___

### mounted

• **mounted**: `boolean`

___

### plugins

• **plugins**: [`Plugin`](../#plugin)[]

## Methods

### deploy

▸ **deploy**(`data`): `any`

Deploy the function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`DeployData`](../#deploydata) | {object} data |

#### Returns

`any`

___

### export

▸ **export**(): `Object`

Export the function

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `handler` | [`ExportedHandler`](../#exportedhandler)\<`TEvent`, `TContext`, `TResult`\> |

___

### invoke

▸ **invoke**(`data`): `Promise`\<`void`\>

Invoke the function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`InvokeData`](../#invokedata)\<`TEvent`, `TContext`, `TResult`\> | {object} data |

#### Returns

`Promise`\<`void`\>

___

### mount

▸ **mount**(`data`): `Promise`\<`void`\>

First time mount the function

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.config?` | [`Config`](../#config) |
| `data.context` | `TContext` |
| `data.event` | `TEvent` |
| `data.logger?` | `Logger` |

#### Returns

`Promise`\<`void`\>
