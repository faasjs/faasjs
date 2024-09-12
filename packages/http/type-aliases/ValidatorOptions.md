[@faasjs/http](../README.md) / ValidatorOptions

# Type Alias: ~~ValidatorOptions\<Content\>~~

> **ValidatorOptions**\<`Content`\>: `object`

## Type Parameters

• **Content** = `Record`\<`string`, `any`\>

## Type declaration

### ~~onError()?~~

> `optional` **onError**: (`type`, `key`, `value`?) => `object` \| `void`

#### Parameters

• **type**: `string`

• **key**: `string` \| `string`[]

• **value?**: `any`

#### Returns

`object` \| `void`

### ~~rules~~

> **rules**: `{ [k in keyof Content]?: ValidatorRuleOptions }`

### ~~whitelist?~~

> `optional` **whitelist**: `"error"` \| `"ignore"`

## Deprecated
