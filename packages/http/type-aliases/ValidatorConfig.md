[@faasjs/http](../README.md) / ValidatorConfig

# Type alias: ValidatorConfig\<TParams, TCookie, TSession\>

> **ValidatorConfig**\<`TParams`, `TCookie`, `TSession`\>: `Object`

## Type parameters

• **TParams** extends `Record`\<`string`, `any`\> = `any`

• **TCookie** extends `Record`\<`string`, `string`\> = `any`

• **TSession** extends `Record`\<`string`, `string`\> = `any`

## Type declaration

### before?

> **`optional`** **before**: `BeforeOption`

### cookie?

> **`optional`** **cookie**: [`ValidatorOptions`](ValidatorOptions.md)\<`TCookie`\>

### params?

> **`optional`** **params**: [`ValidatorOptions`](ValidatorOptions.md)\<`TParams`\>

### session?

> **`optional`** **session**: [`ValidatorOptions`](ValidatorOptions.md)\<`TSession`\>
