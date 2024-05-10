[@faasjs/http](../README.md) / ValidatorOptions

# Type alias: ValidatorOptions\<Content\>

> **ValidatorOptions**\<`Content`\>: `object`

## Type parameters

• **Content** = `Record`\<`string`, `any`\>

## Type declaration

### onError()?

> `optional` **onError**: (`type`, `key`, `value`?) => `object` \| `void`

#### Parameters

• **type**: `string`

• **key**: `string` \| `string`[]

• **value?**: `any`

#### Returns

`object` \| `void`

### rules

> **rules**: `{ [k in keyof Content]?: ValidatorRuleOptions }`

### whitelist?

> `optional` **whitelist**: `"error"` \| `"ignore"`
