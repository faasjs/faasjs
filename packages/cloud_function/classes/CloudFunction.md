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

• **new CloudFunction**(`config?`)

创建云函数配置

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`CloudFunctionConfig`](../modules.md#cloudfunctionconfig) | 配置项，这些配置将强制覆盖默认配置 |

#### Defined in

[index.ts:92](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L92)

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
| `triggers?` | { `name`: `string` ; `type`: `string` ; `value`: `string`  }[] |

#### Defined in

[index.ts:55](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L55)

___

### context

• **context**: `any`

#### Defined in

[index.ts:54](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L54)

___

### event

• **event**: `any`

#### Defined in

[index.ts:53](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L53)

___

### name

• `Readonly` **name**: `string` = `Name`

#### Implementation of

Plugin.name

#### Defined in

[index.ts:52](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L52)

___

### type

• `Readonly` **type**: `string` = `Name`

#### Implementation of

Plugin.type

#### Defined in

[index.ts:51](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L51)

## Methods

### invoke

▸ **invoke**<`TData`\>(`name`, `data?`, `options?`): `Promise`<`void`\>

异步触发云函数

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TData` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 云函数文件名或云函数名 |
| `data?` | `TData` | 参数 |
| `options?` | `Object` | 额外配置项 |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:164](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L164)

___

### invokeSync

▸ **invokeSync**<`TResult`, `TData`\>(`name`, `data?`, `options?`): `Promise`<`TResult`\>

同步调用云函数

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |
| `TData` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | 云函数文件名或云函数名 |
| `data?` | `TData` | 参数 |
| `options?` | `Object` | 额外配置项 |

#### Returns

`Promise`<`TResult`\>

#### Defined in

[index.ts:184](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L184)

___

### onDeploy

▸ **onDeploy**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `DeployData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onDeploy

#### Defined in

[index.ts:104](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L104)

___

### onInvoke

▸ **onInvoke**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `InvokeData`<`any`, `any`, `any`\> |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onInvoke

#### Defined in

[index.ts:148](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L148)

___

### onMount

▸ **onMount**(`data`, `next`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `MountData` |
| `next` | `Next` |

#### Returns

`Promise`<`void`\>

#### Implementation of

Plugin.onMount

#### Defined in

[index.ts:127](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L127)
