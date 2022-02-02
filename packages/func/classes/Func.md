# Class: Func<TEvent, TContext, TResult\>

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
- [logger](Func.md#logger)
- [mounted](Func.md#mounted)
- [plugins](Func.md#plugins)

### Methods

- [compose](Func.md#compose)
- [deploy](Func.md#deploy)
- [export](Func.md#export)
- [invoke](Func.md#invoke)
- [mount](Func.md#mount)

## Constructors

### constructor

• **new Func**<`TEvent`, `TContext`, `TResult`\>(`config`)

新建流程

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | `any` |
| `TContext` | `any` |
| `TResult` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`FuncConfig`](../modules.md#funcconfig)<`TEvent`, `TContext`, `any`\> | 配置项 |

## Properties

### config

• **config**: [`Config`](../modules.md#config)

___

### filename

• `Optional` **filename**: `string`

___

### handler

• `Optional` **handler**: [`Handler`](../modules.md#handler)<`TEvent`, `TContext`, `TResult`\>

___

### logger

• **logger**: `Logger`

___

### mounted

• **mounted**: `boolean`

___

### plugins

• **plugins**: [`Plugin`](../modules.md#plugin)[]

## Methods

### compose

▸ **compose**(`key`): (`data`: `any`, `next?`: () => `void`) => `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`LifeCycleKey`](../modules.md#lifecyclekey) |

#### Returns

`fn`

▸ (`data`, `next?`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `next?` | () => `void` |

##### Returns

`any`

___

### deploy

▸ **deploy**(`data`): `any`

发布云资源

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`DeployData`](../modules.md#deploydata) | 代码包信息 |

#### Returns

`any`

___

### export

▸ **export**(`config?`): `Object`

创建触发函数

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`Config`](../modules.md#config) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `handler` | [`ExportedHandler`](../modules.md#exportedhandler)<`TEvent`, `TContext`, `TResult`\> |

___

### invoke

▸ **invoke**(`data`): `Promise`<`void`\>

执行云函数

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`InvokeData`](../modules.md#invokedata)<`TEvent`, `TContext`, `TResult`\> | 执行信息 |

#### Returns

`Promise`<`void`\>

___

### mount

▸ **mount**(`data`): `Promise`<`void`\>

启动云实例

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.config?` | [`Config`](../modules.md#config) |
| `data.context` | `TContext` |
| `data.event` | `TEvent` |

#### Returns

`Promise`<`void`\>
