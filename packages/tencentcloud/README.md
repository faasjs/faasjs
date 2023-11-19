# @faasjs/tencentcloud

[![License: MIT](https://img.shields.io/npm/l/@faasjs/tencentcloud.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/tencentcloud/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/tencentcloud/stable.svg)](https://www.npmjs.com/package/@faasjs/tencentcloud)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/tencentcloud/beta.svg)](https://www.npmjs.com/package/@faasjs/tencentcloud)

FaasJS's tencentcloud provider.

## Install

    npm install @faasjs/tencentcloud

## Modules

### Classes

- [Provider](classes/Provider.md)

### Type Aliases

- [TencentcloudConfig](#tencentcloudconfig)

### Functions

- [request](#request)

## Type Aliases

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

▸ **request**\<`T`\>(`«destructured»`): `Promise`\<`T`\>

腾讯云请求封装

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`TencentcloudConfig`](#tencentcloudconfig) & \{ `action`: `string` ; `payload`: \{ `[key: string]`: `any`;  } ; `service`: `string` ; `version`: `string`  } |

#### Returns

`Promise`\<`T`\>
