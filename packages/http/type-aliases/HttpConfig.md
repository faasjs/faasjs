[@faasjs/http](../README.md) / HttpConfig

# Type alias: HttpConfig\<TParams, TCookie, TSession\>

> **HttpConfig**\<`TParams`, `TCookie`, `TSession`\>: `Object`

## Type parameters

• **TParams** extends `Record`\<`string`, `any`\> = `any`

• **TCookie** extends `Record`\<`string`, `string`\> = `any`

• **TSession** extends `Record`\<`string`, `string`\> = `any`

## Index signature

 \[`key`: `string`\]: `any`

## Type declaration

### config?

> **`optional`** **config**: `Object`

#### Index signature

 \[`key`: `string`\]: `any`

### config.cookie?

> **`optional`** **cookie**: [`CookieOptions`](CookieOptions.md)

### config.functionName?

> **`optional`** **functionName**: `string`

### config.ignorePathPrefix?

> **`optional`** **ignorePathPrefix**: `string`

### config.method?

> **`optional`** **method**: `"BEGIN"` \| `"GET"` \| `"POST"` \| `"DELETE"` \| `"HEAD"` \| `"PUT"` \| `"OPTIONS"` \| `"TRACE"` \| `"PATCH"` \| `"ANY"`

POST as default

### config.path?

> **`optional`** **path**: `string`

file relative path as default

### config.timeout?

> **`optional`** **timeout**: `number`

### name?

> **`optional`** **name**: `string`

### validator?

> **`optional`** **validator**: [`ValidatorConfig`](ValidatorConfig.md)\<`TParams`, `TCookie`, `TSession`\>
