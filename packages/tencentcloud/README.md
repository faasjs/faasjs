# @faasjs/tencentcloud

腾讯云适配

[![License: MIT](https://img.shields.io/npm/l/@faasjs/tencentcloud.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/tencentcloud/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/tencentcloud/stable.svg)](https://www.npmjs.com/package/@faasjs/tencentcloud)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/tencentcloud/beta.svg)](https://www.npmjs.com/package/@faasjs/tencentcloud)

https://faasjs.com/guide/tencentcloud.html

## Modules

### Classes

- [Provider](classes/Provider.md)

### Type aliases

- [TencentcloudConfig](modules.md#tencentcloudconfig)

### Functions

- [request](modules.md#request)

## Type aliases

### TencentcloudConfig

Ƭ **TencentcloudConfig**: `Object`

云 API 配置项
优先读取环境变量，如果没有则读取入参

#### Type declaration

| Name | Type |
| :------ | :------ |
| `appId?` | `string` |
| `region?` | `string` |
| `secretId?` | `string` |
| `secretKey?` | `string` |
| `token?` | `string` |

## Functions

### request

▸ **request**<`T`\>(`__namedParameters`): `Promise`<`T`\>

腾讯云请求封装

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`TencentcloudConfig`](modules.md#tencentcloudconfig) & { `action`: `string` ; `payload`: { [key: string]: `any`;  } ; `service`: `string` ; `version`: `string`  } |

#### Returns

`Promise`<`T`\>
