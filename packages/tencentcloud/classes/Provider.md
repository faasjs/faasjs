# Class: Provider

## Implements

- `CloudFunctionAdapter`

## Table of contents

### Constructors

- [constructor](Provider.md#constructor)

### Properties

- [config](Provider.md#config)
- [logger](Provider.md#logger)

### Methods

- [deploy](Provider.md#deploy)
- [invokeCloudFunction](Provider.md#invokecloudfunction)
- [invokeSyncCloudFunction](Provider.md#invokesynccloudfunction)

## Constructors

### constructor

• **new Provider**(`config`): [`Provider`](Provider.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`TencentcloudConfig`](../#tencentcloudconfig) |

#### Returns

[`Provider`](Provider.md)

## Properties

### config

• **config**: [`TencentcloudConfig`](../#tencentcloudconfig)

___

### logger

• **logger**: `Logger`

## Methods

### deploy

▸ **deploy**(`type`, `data`, `config`): `Promise`\<`void`\>

部署

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"cloud_function"`` \| ``"http"`` | {string} 发布类型 |
| `data` | `DeployData` | {object} 部署环境配置 |
| `config` | `Object` | {Logger} 部署对象配置 |

#### Returns

`Promise`\<`void`\>

___

### invokeCloudFunction

▸ **invokeCloudFunction**(`name`, `data`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `data` | `Object` |
| `data.context` | `any` |
| `data.event` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

CloudFunctionAdapter.invokeCloudFunction

___

### invokeSyncCloudFunction

▸ **invokeSyncCloudFunction**\<`TResult`\>(`name`, `data`, `options?`): `Promise`\<`TResult`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `data` | `Object` |
| `data.context` | `any` |
| `data.event` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`\<`TResult`\>

#### Implementation of

CloudFunctionAdapter.invokeSyncCloudFunction
