[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / Options

# Type Alias: Options

> **Options** = `RequestInit` & `object`

Configuration options for FaasJS requests.

Extends the standard RequestInit interface with FaasJS-specific options for
customizing request behavior, adding request hooks, and overriding defaults.

## Type Declaration

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

Base URL override for the current request; it also selects the registered React client.

### beforeRequest?

> `optional` **beforeRequest?**: (`{
    action,
    params,
    options,
    headers,
  }`) => `Promise`\<`void`>>>>>>\>

Async hook called after default and per-request options are merged, but before
mock resolution or the final network/custom request dispatch.

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

> `optional` **headers?**: `Record`\<`string`, `string`>>>>>>\>

### request?

> `optional` **request?**: (`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)>>>>>>\>

Custom request implementation used instead of native `fetch` when no global
mock is active.

#### Parameters

##### url

`string`

##### options

`Options`

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\>

### stream?

> `optional` **stream?**: `boolean`

When `true`, return the native fetch response so callers can consume the stream manually.
