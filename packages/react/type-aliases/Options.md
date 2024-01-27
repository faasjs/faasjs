[@faasjs/react](../README.md) / Options

# Type alias: Options

> **Options**: `RequestInit` & `Object`

## Type declaration

### beforeRequest?

> **beforeRequest**?: (`{
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
  }**: `Object`

• **\{
    action,
    params,
    options,
    headers,
  }\.action**: `string`

• **\{
    action,
    params,
    options,
    headers,
  }\.headers**: `Record`\<`string`, `string`\>

• **\{
    action,
    params,
    options,
    headers,
  }\.options**: [`Options`](Options.md)

• **\{
    action,
    params,
    options,
    headers,
  }\.params**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

### headers?

> **headers**?: `Record`\<`string`, `string`\>

### request?

> **request**?: \<`PathOrData`\>(`url`, `options`) => `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

custom request

#### Type parameters

• **PathOrData** extends [`FaasAction`](FaasAction.md)

#### Parameters

• **url**: `string`

• **options**: [`Options`](Options.md)

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>
