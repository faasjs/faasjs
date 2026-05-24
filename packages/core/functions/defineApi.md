[@faasjs/core](../README.md) / defineApi

# Function: defineApi()

> **defineApi**\<`TSchema`, `THandler`\>(`options`): [`Func`](../classes/Func.md)\<`Record`\<`string`, `unknown`\>, `unknown`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

Create an HTTP API function with optional Zod validation.

The `http` plugin must come from `faas.yaml` or explicit code injection.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### THandler

`THandler` _extends_ (`data`) => `Promise`\<`any`\>

Handler signature used to infer the response type.

## Parameters

### options

`object`

Schema and handler used to build the API function.

## Returns

[`Func`](../classes/Func.md)\<`Record`\<`string`, `unknown`\>, `unknown`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

## Throws

When the required `http` plugin is missing from `faas.yaml` and no plugin was injected in code.

## Throws

When `event.params` fails schema validation.

## Example

```ts
import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

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
