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
| `config` | [`AWSConfig`](../modules.md#awsconfig) |

#### Defined in

[index.ts:17](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L17)

## Properties

### config

• **config**: [`AWSConfig`](../modules.md#awsconfig)

#### Defined in

[index.ts:14](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L14)

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

#### Defined in

[index.ts:28](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L28)

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

#### Defined in

[index.ts:29](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L29)

___

### logger

• **logger**: `Logger`

#### Defined in

[index.ts:15](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L15)

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

[index.ts:37](https://github.com/faasjs/faasjs/blob/1705fd2/packages/aws/src/index.ts#L37)
