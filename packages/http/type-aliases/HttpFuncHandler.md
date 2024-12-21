[@faasjs/http](../README.md) / HttpFuncHandler

# Type Alias: HttpFuncHandler()\<TParams, TCookie, TSession, TResult\>

> **HttpFuncHandler**\<`TParams`, `TCookie`, `TSession`, `TResult`\>: (`data`) => `Promise`\<`TResult`\>

## Type Parameters

• **TParams** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **TCookie** *extends* `Record`\<`string`, `string`\> = `Record`\<`string`, `string`\>

• **TSession** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

• **TResult** = `any`

## Parameters

### data

`InvokeData`\<\{ `[key: string]`: `any`;  `params`: `TParams`; \}\> & `object`

## Returns

`Promise`\<`TResult`\>
