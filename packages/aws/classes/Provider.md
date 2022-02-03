# Class: Provider

## Implements

- `CloudFunctionAdapter`

## Table of contents

### Constructors

- [constructor](Provider.md#constructor)

### Properties

- [config](Provider.md#config)
- [invokeCloudFunction](Provider.md#invokecloudfunction)
- [invokeSyncCloudFunction](Provider.md#invokesynccloudfunction)
- [logger](Provider.md#logger)

### Methods

- [deploy](Provider.md#deploy)

## Constructors

### constructor

• **new Provider**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AWSConfig`](../#awsconfig) |

## Properties

### config

• **config**: [`AWSConfig`](../#awsconfig)

___

### invokeCloudFunction

• **invokeCloudFunction**: (`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`<`void`\>

#### Type declaration

▸ (`name`, `data`, `options?`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `data` | `any` |
| `options?` | `any` |

##### Returns

`Promise`<`void`\>

#### Implementation of

CloudFunctionAdapter.invokeCloudFunction

___

### invokeSyncCloudFunction

• **invokeSyncCloudFunction**: <TResult\>(`name`: `string`, `data`: `any`, `options?`: `any`) => `Promise`<`TResult`\>

#### Type declaration

▸ <`TResult`\>(`name`, `data`, `options?`): `Promise`<`TResult`\>

##### Type parameters

| Name |
| :------ |
| `TResult` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `data` | `any` |
| `options?` | `any` |

##### Returns

`Promise`<`TResult`\>

#### Implementation of

CloudFunctionAdapter.invokeSyncCloudFunction

___

### logger

• **logger**: `Logger`

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
