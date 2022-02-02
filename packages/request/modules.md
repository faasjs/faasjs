# @faasjs/request

## Table of contents

### Type aliases

- [Request](modules.md#request)
- [RequestOptions](modules.md#requestoptions)
- [Response](modules.md#response)

### Functions

- [querystringify](modules.md#querystringify)
- [request](modules.md#request)
- [setMock](modules.md#setmock)

## Type aliases

### Request

Ƭ **Request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body?` | `Object` |
| `headers?` | `http.OutgoingHttpHeaders` |
| `host?` | `string` |
| `method?` | `string` |
| `path?` | `string` |
| `query?` | `http.OutgoingHttpHeaders` |

#### Defined in

[index.ts:8](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L8)

___

### RequestOptions

Ƭ **RequestOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `agent?` | `boolean` | - |
| `auth?` | `string` | HTTP 认证头，格式为 user:password |
| `body?` | { [key: string]: `any`;  } \| `string` | 请求体 |
| `downloadStream?` | `NodeJS.WritableStream` | 下载流，用于直接将响应内容保存到本地文件，通过 fs.createWriteStream 创建 |
| `file?` | `string` | 上传文件的完整路径 |
| `headers?` | `http.OutgoingHttpHeaders` | 请求头 |
| `method?` | `string` | 请求方法，默认为 GET |
| `passphrase?` | `string` | - |
| `pfx?` | `Buffer` | - |
| `query?` | `Object` | 请求参数，放置于 path 后，若需放置在 body 中，请使用 body 参数 |
| `timeout?` | `number` | 最长耗时，单位为毫秒 |
| `parse?` | (`body`: `string`) => `any` | body 解析器，默认为 JSON.parse |

#### Defined in

[index.ts:27](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L27)

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
| `request?` | [`Request`](modules.md#request) |
| `statusCode?` | `number` |
| `statusMessage?` | `string` |

#### Defined in

[index.ts:19](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L19)

## Functions

### querystringify

▸ **querystringify**(`obj`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

`string`

#### Defined in

[index.ts:68](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L68)

___

### request

▸ **request**<`T`\>(`url`, `[options={}]?`): `Promise`<[`Response`](modules.md#response)<`T`\>\>

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
| `[options={}]` | [`RequestOptions`](modules.md#requestoptions) | 参数和配置 |

#### Returns

`Promise`<[`Response`](modules.md#response)<`T`\>\>

#### Defined in

[index.ts:112](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L112)

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

#### Defined in

[index.ts:64](https://github.com/faasjs/faasjs/blob/1705fd2/packages/request/src/index.ts#L64)
