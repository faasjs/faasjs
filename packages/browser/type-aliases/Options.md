[@faasjs/browser](../README.md) / Options

# Type Alias: Options

> **Options** = `RequestInit` & `object`

Configuration options for FaasJS requests.

Extends the standard RequestInit interface with FaasJS-specific options for
customizing request behavior, adding request hooks, and overriding defaults.

## Type Declaration

### baseUrl?

> `optional` **baseUrl**: [`BaseUrl`](BaseUrl.md)

### beforeRequest()?

> `optional` **beforeRequest**: (`{
    action,
    params,
    options,
    headers,
  }`) => `Promise`\<`void`\>

trigger before request

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

> `optional` **headers**: `Record`\<`string`, `string`\>

### request()?

> `optional` **request**: \<`PathOrData`\>(`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\>\>

custom request

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

#### Parameters

##### url

`string`

##### options

`Options`

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\>\>

### stream?

> `optional` **stream**: `boolean`

## Remarks

- Options can be provided at client creation (defaultOptions) or per-request
- Per-request options override client default options
- headers are merged: per-request headers override default headers
- beforeRequest hook is called before the request is sent, allowing modification
- Custom request function completely replaces the default fetch implementation
- baseUrl in options overrides the client's baseUrl for this specific request
- When stream is true, returns the native fetch Response instead of wrapped Response

## See

 - FaasBrowserClient for client creation
 - Response for response object structure
