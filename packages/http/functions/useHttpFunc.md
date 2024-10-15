[@faasjs/http](../README.md) / useHttpFunc

# Function: useHttpFunc()

> **useHttpFunc**\<`TParams`, `TCookie`, `TSession`, `TResult`\>(`handler`, `config`?): `Func`\<`object`, `any`, `TResult`\>

A hook to create an HTTP function with specified handler and configuration.

## Type Parameters

• **TParams** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

The type of the parameters object.

• **TCookie** *extends* `Record`\<`string`, `string`\> = `Record`\<`string`, `string`\>

The type of the cookies object.

• **TSession** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

The type of the session object.

• **TResult** = `any`

The type of the result.

## Parameters

• **handler**

The function handler to be used.

• **config?**

Optional configuration object.

• **config.http?**: [`HttpConfig`](../type-aliases/HttpConfig.md)\<`any`, `any`, `any`\>

Optional HTTP configuration.

## Returns

`Func`\<`object`, `any`, `TResult`\>

The created HTTP function.

### params?

> `optional` **params**: `TParams`