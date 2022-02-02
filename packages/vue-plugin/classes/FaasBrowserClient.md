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

#### Defined in

[browser/src/index.ts:70](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L70)

## Properties

### defaultOptions

• **defaultOptions**: [`Options`](../modules.md#options)

#### Defined in

[browser/src/index.ts:63](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L63)

___

### host

• **host**: `string`

#### Defined in

[browser/src/index.ts:62](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L62)

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

#### Defined in

[browser/src/index.ts:83](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L83)
