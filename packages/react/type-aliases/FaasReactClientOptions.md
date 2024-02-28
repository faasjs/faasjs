[@faasjs/react](../README.md) / FaasReactClientOptions

# Type alias: FaasReactClientOptions

> **FaasReactClientOptions**: `Object`

## Type declaration

### domain

> **domain**: `string`

### onError?

> **`optional`** **onError**: (`action`, `params`) => (`res`) => `Promise`\<`void`\>

#### Parameters

• **action**: `string`

• **params**: `Record`\<`string`, `any`\>

#### Returns

`Function`

> ##### Parameters
>
> • **res**: [`ResponseError`](../classes/ResponseError.md)
>
> ##### Returns
>
> `Promise`\<`void`\>
>

### options?

> **`optional`** **options**: [`Options`](Options.md)
