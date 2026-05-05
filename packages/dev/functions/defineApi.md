[@faasjs/dev](../README.md) / defineApi

# Function: defineApi()

> **defineApi**\<`TSchema`, `TEvent`, `TContext`, `THandler`\>(`options`): [`Func`](../classes/Func.md)\<`DefineApiEvent`\<`TSchema`, `TEvent`\>, `TContext`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

Create an HTTP API function with optional Zod validation.

The `http` plugin must come from `faas.yaml` or explicit code injection.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### TEvent

`TEvent` = `Record`\<`string`, `unknown`\>

Raw event type passed to the function.

### TContext

`TContext` = `unknown`

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

## Throws

When the required `http` plugin is missing from `faas.yaml` and no plugin was injected in code.

## Throws

When `event.params` fails schema validation.

## Example

```ts
import { defineApi } from '@faasjs/core'
import * as z from 'zod'

const schema = z.object({
  name: z.string().min(1),
})

export default defineApi({
  schema,
  async handler({ params }) {
    return {
      message: `Hello, ${params.name}`,
    }
  },
})
```
