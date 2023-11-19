# @faasjs/request

[![License: MIT](https://img.shields.io/npm/l/@faasjs/request.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/request/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/request/stable.svg)](https://www.npmjs.com/package/@faasjs/request)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/request/beta.svg)](https://www.npmjs.com/package/@faasjs/request)

FaasJS's request module.

## Install

    npm install @faasjs/request

## Modules

### Classes

- [ResponseError](classes/ResponseError.md)

### Type Aliases

- [Request](#request)
- [RequestOptions](#requestoptions)
- [Response](#response)

### Functions

- [querystringify](#querystringify)
- [request](#request-1)
- [setMock](#setmock)

## Type Aliases

### Request

Ƭ **Request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body?` | \{ `[key: string]`: `any`;  } |
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
| `auth?` | `string` | The authentication credentials to use for the request. Format: `username:password` |
| `body?` | \{ `[key: string]`: `any`;  } \| `string` | - |
| `downloadFile?` | `string` | Path of downloading a file from the server. ```ts await request('https://example.com', { downloadFile: 'filepath' }) ``` |
| `downloadStream?` | `NodeJS.WritableStream` | Create a write stream to download a file. ```ts import { createWriteStream } from 'fs' const stream = createWriteStream('filepath') await request('https://example.com', { downloadStream: stream }) ``` |
| `file?` | `string` | Path of uploading a file to the server. ```ts await request('https://example.com', { file: 'filepath' }) ``` |
| `headers?` | `http.OutgoingHttpHeaders` | - |
| `logger?` | `Logger` | - |
| `method?` | `string` | The HTTP method to use when making the request. Defaults to GET. |
| `parse?` | (`body`: `string`) => `any` | Body parser. Defaults to `JSON.parse`. |
| `passphrase?` | `string` | - |
| `pfx?` | `Buffer` | - |
| `query?` | \{ `[key: string]`: `any`;  } | - |
| `timeout?` | `number` | - |

___

### Response

Ƭ **Response**\<`T`\>: `Object`

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

▸ **request**\<`T`\>(`url`, `options?`): `Promise`\<[`Response`](#response)\<`T`\>\>

Request

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | Url |
| `options?` | [`RequestOptions`](#requestoptions) | Options |

#### Returns

`Promise`\<[`Response`](#response)\<`T`\>\>

**`Url`**

https://faasjs.com/doc/request.html

___

### setMock

▸ **setMock**(`handler`): `void`

Mock requests

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | `Mock` | {function \| null} null to disable mock |

#### Returns

`void`

**`Example`**

```ts
setMock(async (url, options) => Promise.resolve({ headers: {}, statusCode: 200, body: { data: 'ok' } }))
```
