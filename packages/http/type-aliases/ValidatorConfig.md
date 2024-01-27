[@faasjs/http](../README.md) / ValidatorConfig

# Type alias: ValidatorConfig\<TParams, TCookie, TSession\>

> **ValidatorConfig**\<`TParams`, `TCookie`, `TSession`\>: `Object`

## Type parameters

• **TParams** extends `Record`\<`string`, `any`\> = `any`

• **TCookie** extends `Record`\<`string`, `string`\> = `any`

• **TSession** extends `Record`\<`string`, `string`\> = `any`

## Type declaration

### before?

> **before**?: `BeforeOption`

### cookie?

> **cookie**?: [`ValidatorOptions`](ValidatorOptions.md)\<`TCookie`\>

### params?

> **params**?: [`ValidatorOptions`](ValidatorOptions.md)\<`TParams`\>

### session?

> **session**?: [`ValidatorOptions`](ValidatorOptions.md)\<`TSession`\>
