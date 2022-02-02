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

#### Defined in

[index.ts:118](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L118)

## Properties

### config

• **config**: [`Config`](../modules.md#config)

#### Defined in

[index.ts:105](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L105)

___

### filename

• `Optional` **filename**: `string`

#### Defined in

[index.ts:107](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L107)

___

### handler

• `Optional` **handler**: [`Handler`](../modules.md#handler)<`TEvent`, `TContext`, `TResult`\>

#### Defined in

[index.ts:103](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L103)

___

### logger

• **logger**: `Logger`

#### Defined in

[index.ts:104](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L104)

___

### mounted

• **mounted**: `boolean`

#### Defined in

[index.ts:106](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L106)

___

### plugins

• **plugins**: [`Plugin`](../modules.md#plugin)[]

#### Defined in

[index.ts:102](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L102)

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

#### Defined in

[index.ts:142](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L142)

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

#### Defined in

[index.ts:195](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L195)

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

#### Defined in

[index.ts:251](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L251)

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

#### Defined in

[index.ts:230](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L230)

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

#### Defined in

[index.ts:204](https://github.com/faasjs/faasjs/blob/1705fd2/packages/func/src/index.ts#L204)
