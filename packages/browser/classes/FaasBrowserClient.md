# Class: FaasBrowserClient

## Table of contents

### Constructors

- [constructor](FaasBrowserClient.md#constructor)

### Properties

- [defaultOptions](FaasBrowserClient.md#defaultoptions)
- [host](FaasBrowserClient.md#host)

### Methods

- [action](FaasBrowserClient.md#action)

## Constructors

### constructor

• **new FaasBrowserClient**(`baseUrl`, `options?`)

创建 FaasJS 浏览器客户端

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | 网关地址 |
| `options?` | [`Options`](../modules.md#options) | 默认配置项 |

## Properties

### defaultOptions

• **defaultOptions**: [`Options`](../modules.md#options)

___

### host

• **host**: `string`

## Methods

### action

▸ **action**<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`<[`Response`](Response.md)<`FaasData`<`PathOrData`\>\>\>

发起请求

#### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `action` | `string` \| `PathOrData` | 动作名称 |
| `params?` | `FaasParams`<`PathOrData`\> | 动作参数 |
| `options?` | [`Options`](../modules.md#options) | 默认配置项 |

#### Returns

`Promise`<[`Response`](Response.md)<`FaasData`<`PathOrData`\>\>\>
