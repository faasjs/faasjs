[@faasjs/browser](../README.md) / Options

# Type Alias: Options

> **Options**: `RequestInit` & `object`

## Type declaration

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

• **\{
    action,
    params,
    options,
    headers,
  \}**

• **\{
    action,
    params,
    options,
    headers,
  \}.action**: `string`

• **\{
    action,
    params,
    options,
    headers,
  \}.headers**: `Record`\<`string`, `string`\>

• **\{
    action,
    params,
    options,
    headers,
  \}.options**: [`Options`](Options.md)

• **\{
    action,
    params,
    options,
    headers,
  \}.params**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

### request()?

> `optional` **request**: \<`PathOrData`\>(`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\>\>

custom request

#### Type Parameters

• **PathOrData** *extends* `FaasAction`

#### Parameters

• **url**: `string`

• **options**: [`Options`](Options.md)

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<`FaasData`\<`PathOrData`\>\>\>
