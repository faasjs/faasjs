[@faasjs/http](../README.md) / ValidatorOptions

# Type alias: ValidatorOptions\<Content\>

> **ValidatorOptions**\<`Content`\>: `Object`

## Type parameters

• **Content** = `Record`\<`string`, `any`\>

## Type declaration

### onError?

> **`optional`** **onError**: (`type`, `key`, `value`?) => `Object` \| `void`

#### Parameters

• **type**: `string`

• **key**: `string` \| `string`[]

• **value?**: `any`

#### Returns

`Object` \| `void`

### rules

> **rules**: `{ [k in keyof Content]?: ValidatorRuleOptions }`

### whitelist?

> **`optional`** **whitelist**: `"error"` \| `"ignore"`
