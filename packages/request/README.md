# @faasjs/request

[![License: MIT](https://img.shields.io/npm/l/@faasjs/request.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/request/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/request/stable.svg)](https://www.npmjs.com/package/@faasjs/request)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/request/beta.svg)](https://www.npmjs.com/package/@faasjs/request)

FaasJS's request module.

## Install

    npm install @faasjs/request

## Modules

### Type aliases

- [Request](#request)
- [RequestOptions](#requestoptions)
- [Response](#response)

### Functions

- [querystringify](#querystringify)
- [request](#request-1)
- [setMock](#setmock)

## Type aliases

### Request

Ƭ **Request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body?` | { `[key: string]`: `any`;  } |
| `headers?` | `http.OutgoingHttpHeaders` |
| `host?` | `string` |
| `method?` | `string` |
| `path?` | `string` |
| `query?` | `http.OutgoingHttpHeaders` |

___

### RequestOptions

Ƭ **RequestOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `agent?` | `boolean` | - |
| `auth?` | `string` | HTTP 认证头，格式为 user:password |
| `body?` | { `[key: string]`: `any`;  } \| `string` | 请求体 |
| `downloadStream?` | `NodeJS.WritableStream` | 下载流，用于直接将响应内容保存到本地文件，通过 fs.createWriteStream 创建 |
| `file?` | `string` | 上传文件的完整路径 |
| `headers?` | `http.OutgoingHttpHeaders` | 请求头 |
| `method?` | `string` | 请求方法，默认为 GET |
| `passphrase?` | `string` | - |
| `pfx?` | `Buffer` | - |
| `query?` | { `[key: string]`: `any`;  } | 请求参数，放置于 path 后，若需放置在 body 中，请使用 body 参数 |
| `timeout?` | `number` | 最长耗时，单位为毫秒 |
| `parse?` | (`body`: `string`) => `any` | body 解析器，默认为 JSON.parse |

___

### Response

Ƭ **Response**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `T` |
| `headers` | `http.OutgoingHttpHeaders` |
| `request?` | [`Request`](#request) |
| `statusCode?` | `number` |
| `statusMessage?` | `string` |

## Functions

### querystringify

▸ **querystringify**(`obj`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`string`

___

### request

▸ **request**<`T`\>(`url`, `[options={}]?`): `Promise`<[`Response`](#response)<`T`\>\>

发起网络请求

**`url`** https://faasjs.com/doc/request.html

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | 请求路径或完整网址 |
| `[options={}]` | [`RequestOptions`](#requestoptions) | 参数和配置 |

#### Returns

`Promise`<[`Response`](#response)<`T`\>\>

___

### setMock

▸ **setMock**(`handler`): `void`

设置模拟请求

**`example`** setMock(async (url, options) => Promise.resolve({ headers: {}, statusCode: 200, body: { data: 'ok' } }))

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | `Mock` | 模拟函数，若设置为 null 则表示清除模拟函数 |

#### Returns

`void`
