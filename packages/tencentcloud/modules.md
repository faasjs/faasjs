# @faasjs/tencentcloud

## Table of contents

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

#### Defined in

[index.ts:14](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/index.ts#L14)

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

#### Defined in

[request.ts:10](https://github.com/faasjs/faasjs/blob/1705fd2/packages/tencentcloud/src/request.ts#L10)
