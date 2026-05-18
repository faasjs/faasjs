[@faasjs/react](../README.md) / Options

# Type Alias: Options

> **Options** = `RequestInit` & `object`

Configuration options for FaasJS requests.

Extends the standard RequestInit interface with FaasJS-specific options for
customizing request behavior, adding request hooks, and overriding defaults.

## Type Declaration

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Base URL override for the current request.

### beforeRequest?

> `optional` **beforeRequest?**: (`{

    action,
    params,
    options,
    headers,

}`) => `Promise`\<`void`\>

Async hook called after request options are merged but before the request is sent.

#### Parameters

##### \{

    action,
    params,
    options,
    headers,

\}

###### action

`string`

###### headers

`Record`\<`string`, `string`\>

###### options

`Options`

###### params?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

### request?

> `optional` **request?**: \<`PathOrData`\>(`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

Custom request implementation used instead of the native `fetch`.

#### Type Parameters

##### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](FaasActionUnionType.md)

#### Parameters

##### url

`string`

##### options

`Options`

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### stream?

> `optional` **stream?**: `boolean`

When `true`, return the native fetch response so callers can consume the stream manually.
