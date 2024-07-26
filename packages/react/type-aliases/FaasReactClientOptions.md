[@faasjs/react](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions**: `object`

## Type declaration

### domain

> **domain**: `string`

### onError()?

> `optional` **onError**: (`action`, `params`) => (`res`) => `Promise`\<`void`\>

#### Parameters

• **action**: `string`

• **params**: `Record`\<`string`, `any`\>

#### Returns

`Function`

##### Parameters

• **res**: [`ResponseError`](../classes/ResponseError.md)

##### Returns

`Promise`\<`void`\>

### options?

> `optional` **options**: [`Options`](Options.md)
