[@faasjs/dev](../README.md) / defineApi

# Function: defineApi()

> **defineApi**\<`TSchema`, `TEvent`, `TContext`, `THandler`\>(`options`): [`Func`](../classes/Func.md)\<`DefineApiEvent`\<`TSchema`, `TEvent`\>, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

Create an HTTP API function with optional Zod validation.

Plugins are always auto-loaded from `func.config.plugins`.
Plugin module exports must be either a named class (normalized from
plugin type) or a default class export.

The `http` plugin is required.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### TEvent

`TEvent` = `any`

Raw event type passed to the function.

### TContext

`TContext` = `any`

Runtime context type.

### THandler

`THandler` _extends_ (`data`) => `Promise`\<`any`\> = (`data`) => `Promise`\<`any`\>

Handler signature used to infer the response type.

## Parameters

### options

`Omit`\<[`DefineApiOptions`](../type-aliases/DefineApiOptions.md)\<`TSchema`, `TEvent`, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>, `"handler"`\> & `object`

Schema and handler used to build the API function.

## Returns

[`Func`](../classes/Func.md)\<`DefineApiEvent`\<`TSchema`, `TEvent`\>, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

## Example

```ts
import { defineApi, z } from '@faasjs/core'

const schema = z.object({
  name: z.string().min(1),
})

export const func = defineApi({
  schema,
  async handler({ params }) {
    return {
      message: `Hello, ${params.name}`,
    }
  },
})
```
