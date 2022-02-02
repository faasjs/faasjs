# @faasjs/cloud_function

## Table of contents

### Classes

- [CloudFunction](classes/CloudFunction.md)

### Type aliases

- [CloudFunctionAdapter](modules.md#cloudfunctionadapter)
- [CloudFunctionConfig](modules.md#cloudfunctionconfig)

### Functions

- [invoke](modules.md#invoke)
- [invokeSync](modules.md#invokesync)
- [useCloudFunction](modules.md#usecloudfunction)

## Type aliases

### CloudFunctionAdapter

Ƭ **CloudFunctionAdapter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `invokeCloudFunction` | (`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`<`void`\> |
| `invokeSyncCloudFunction` | <TResult\>(`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`<`TResult`\> |

#### Defined in

[index.ts:39](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L39)

___

### CloudFunctionConfig

Ƭ **CloudFunctionConfig**: `Object`

云函数配置项

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `Object` | 配置项 |
| `config.memorySize?` | ``64`` \| ``128`` \| ``256`` \| ``384`` \| ``512`` \| ``640`` \| ``768`` \| ``896`` \| ``1024`` \| `number` | 内存大小，单位为MB，默认 64 |
| `config.name?` | `string` | 配置名称 |
| `config.provisionedConcurrent?` | `Object` | 预制并发配置 |
| `config.provisionedConcurrent.executions` | `number` | 预制并发数量 |
| `config.timeout?` | `number` | 执行超时时间，单位为秒，默认 30 |
| `config.triggers?` | { `name?`: `string` ; `type`: ``"timer"`` \| `string` ; `value`: `string`  }[] | 触发器配置 |
| `name?` | `string` | 插件名称 |
| `validator?` | `Object` | - |
| `validator.event?` | `ValidatorConfig` | - |

#### Defined in

[index.ts:9](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L9)

## Functions

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

[index.ts:221](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L221)

___

### invokeSync

▸ **invokeSync**<`TResult`, `TData`\>(`name`, `data?`, `options?`): `Promise`<`TResult`\>

同步触发云函数

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

[index.ts:233](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L233)

___

### useCloudFunction

▸ **useCloudFunction**(`config?`): [`CloudFunction`](classes/CloudFunction.md) & `UseifyPlugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`CloudFunctionConfig`](modules.md#cloudfunctionconfig) \| () => [`CloudFunctionConfig`](modules.md#cloudfunctionconfig) |

#### Returns

[`CloudFunction`](classes/CloudFunction.md) & `UseifyPlugin`

#### Defined in

[index.ts:199](https://github.com/faasjs/faasjs/blob/1705fd2/packages/cloud_function/src/index.ts#L199)
