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

• **new Provider**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`TencentcloudConfig`](../modules.md#tencentcloudconfig) |

#### Defined in

[index.ts:26](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L26)

## Properties

### config

• **config**: [`TencentcloudConfig`](../modules.md#tencentcloudconfig)

#### Defined in

[index.ts:23](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L23)

___

### logger

• **logger**: `Logger`

#### Defined in

[index.ts:24](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L24)

## Methods

### deploy

▸ **deploy**(`type`, `data`, `config`): `Promise`<`void`\>

部署

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | ``"cloud_function"`` \| ``"http"`` | 发布类型 |
| `data` | `DeployData` | 部署环境配置 |
| `config` | `Object` | 部署对象配置 |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:47](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L47)

___

### invokeCloudFunction

▸ **invokeCloudFunction**(`name`, `data`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `data` | `Object` |
| `data.context` | `any` |
| `data.event` | `any` |
| `options?` | `Object` |

#### Returns

`Promise`<`void`\>

#### Implementation of

CloudFunctionAdapter.invokeCloudFunction

#### Defined in

[index.ts:65](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L65)

___

### invokeSyncCloudFunction

▸ **invokeSyncCloudFunction**<`TResult`\>(`name`, `data`, `options?`): `Promise`<`TResult`\>

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

`Promise`<`TResult`\>

#### Implementation of

CloudFunctionAdapter.invokeSyncCloudFunction

#### Defined in

[index.ts:74](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L74)
