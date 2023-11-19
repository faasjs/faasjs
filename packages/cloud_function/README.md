# @faasjs/cloud_function

[![License: MIT](https://img.shields.io/npm/l/@faasjs/cloud_function.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/cloud_function/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/cloud_function/stable.svg)](https://www.npmjs.com/package/@faasjs/cloud_function)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/cloud_function/beta.svg)](https://www.npmjs.com/package/@faasjs/cloud_function)

A FaasJS plugin, let function could create, config and invoke CloudFunction.

## Install

    npm install @faasjs/cloud_function

## Modules

### Classes

- [CloudFunction](classes/CloudFunction.md)

### Type Aliases

- [CloudFunctionAdapter](#cloudfunctionadapter)
- [CloudFunctionConfig](#cloudfunctionconfig)

### Functions

- [invoke](#invoke)
- [invokeSync](#invokesync)
- [useCloudFunction](#usecloudfunction)

## Type Aliases

### CloudFunctionAdapter

Ƭ **CloudFunctionAdapter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `invokeCloudFunction` | (`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`\<`void`\> |
| `invokeSyncCloudFunction` | \<TResult\>(`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`\<`TResult`\> |

___

### CloudFunctionConfig

Ƭ **CloudFunctionConfig**: `Object`

云函数配置项

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | \{ `[key: string]`: `any`; `memorySize?`: ``64`` \| ``128`` \| ``256`` \| ``384`` \| ``512`` \| ``640`` \| ``768`` \| ``896`` \| ``1024`` \| `number` ; `name?`: `string` ; `provisionedConcurrent?`: \{ `executions`: `number`  } ; `timeout?`: `number` ; `triggers?`: \{ `name?`: `string` ; `type`: ``"timer"`` \| `string` ; `value`: `string`  }[]  } | 配置项 |
| `config.memorySize?` | ``64`` \| ``128`` \| ``256`` \| ``384`` \| ``512`` \| ``640`` \| ``768`` \| ``896`` \| ``1024`` \| `number` | 内存大小，单位为MB，默认 64 |
| `config.name?` | `string` | 配置名称 |
| `config.provisionedConcurrent?` | \{ `executions`: `number`  } | 预制并发配置 |
| `config.provisionedConcurrent.executions` | `number` | 预制并发数量 |
| `config.timeout?` | `number` | 执行超时时间，单位为秒，默认 30 |
| `config.triggers?` | \{ `name?`: `string` ; `type`: ``"timer"`` \| `string` ; `value`: `string`  }[] | 触发器配置 |
| `name?` | `string` | 插件名称 |
| `validator?` | \{ `event?`: `ValidatorConfig`  } | - |
| `validator.event?` | `ValidatorConfig` | - |

## Functions

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
| `options?` | `Object` | {object} 额外配置项 |

#### Returns

`Promise`\<`void`\>

___

### invokeSync

▸ **invokeSync**\<`TResult`, `TData`\>(`name`, `data?`, `options?`): `Promise`\<`TResult`\>

同步触发云函数

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
| `options?` | `Object` | {object} 额外配置项 |

#### Returns

`Promise`\<`TResult`\>

___

### useCloudFunction

▸ **useCloudFunction**(`config?`): `UseifyPlugin`\<[`CloudFunction`](classes/CloudFunction.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`CloudFunctionConfig`](#cloudfunctionconfig) \| () => [`CloudFunctionConfig`](#cloudfunctionconfig) |

#### Returns

`UseifyPlugin`\<[`CloudFunction`](classes/CloudFunction.md)\>
