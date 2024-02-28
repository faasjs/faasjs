[@faasjs/tencentcloud](../README.md) / Provider

# Class: Provider

## Implements

- `CloudFunctionAdapter`

## Constructors

### new Provider(config)

> **new Provider**(`config`): [`Provider`](Provider.md)

#### Parameters

• **config**: [`TencentcloudConfig`](../type-aliases/TencentcloudConfig.md)

#### Returns

[`Provider`](Provider.md)

## Properties

### config

> **config**: [`TencentcloudConfig`](../type-aliases/TencentcloudConfig.md)

### logger

> **logger**: `Logger`

## Methods

### deploy()

> **deploy**(`type`, `data`, `config`): `Promise`\<`void`\>

部署

#### Parameters

• **type**: `"cloud_function"` \| `"http"`

\{string\} 发布类型

• **data**: `DeployData`

\{object\} 部署环境配置

• **config**

\{Logger\} 部署对象配置

#### Returns

`Promise`\<`void`\>

### invokeCloudFunction()

> **invokeCloudFunction**(`name`, `data`, `options`?): `Promise`\<`void`\>

#### Parameters

• **name**: `string`

• **data**

• **data\.context**: `any`

• **data\.event?**: `any`

• **options?**

#### Returns

`Promise`\<`void`\>

#### Implementation of

`CloudFunctionAdapter.invokeCloudFunction`

### invokeSyncCloudFunction()

> **invokeSyncCloudFunction**\<`TResult`\>(`name`, `data`, `options`?): `Promise`\<`TResult`\>

#### Type parameters

• **TResult** = `any`

#### Parameters

• **name**: `string`

• **data**

• **data\.context**: `any`

• **data\.event?**: `any`

• **options?**

#### Returns

`Promise`\<`TResult`\>

#### Implementation of

`CloudFunctionAdapter.invokeSyncCloudFunction`
