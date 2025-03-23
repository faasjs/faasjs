[@faasjs/react](../README.md) / Options

# Type Alias: Options

> **Options** = `RequestInit` & `object`

## Type declaration

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

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

> `optional` **request**: \<`PathOrData`\>(`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

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

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>
