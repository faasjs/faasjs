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

> **config**?: `Object`

#### Index signature

 \[`key`: `string`\]: `any`

### config.cookie?

> **config.cookie**?: [`CookieOptions`](CookieOptions.md)

### config.functionName?

> **config.functionName**?: `string`

### config.ignorePathPrefix?

> **config.ignorePathPrefix**?: `string`

### config.method?

> **config.method**?: `"BEGIN"` \| `"GET"` \| `"POST"` \| `"DELETE"` \| `"HEAD"` \| `"PUT"` \| `"OPTIONS"` \| `"TRACE"` \| `"PATCH"` \| `"ANY"`

POST as default

### config.path?

> **config.path**?: `string`

file relative path as default

### config.timeout?

> **config.timeout**?: `number`

### name?

> **name**?: `string`

### validator?

> **validator**?: [`ValidatorConfig`](ValidatorConfig.md)\<`TParams`, `TCookie`, `TSession`\>
