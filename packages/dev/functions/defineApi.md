[@faasjs/dev](../README.md) / defineApi

# Function: defineApi()

> **defineApi**\<`TSchema`, `THandler`\>(`options`): [`Func`](../classes/Func.md)\<`Record`\<`string`, `unknown`\>, `unknown`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

Create an HTTP API function with optional Zod validation.

The `http` plugin must be loaded before invocation. Server and loader entrypoints
resolve configured plugins from `faas.yaml`; direct `defineApi().export().handler()`
tests must inject `new Http()` in code.

## Type Parameters

### TSchema

`TSchema` _extends_ `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> \| `undefined` = `undefined`

Zod schema used to validate `event.params`.

### THandler

`THandler` _extends_ (`data`) => `Promise`\<`any`\> = (`data`) => `Promise`\<`any`\>

Handler signature used to infer the response type.

## Parameters

### options

Schema and handler used to build the API function.

#### handler

`THandler`

Async business handler executed after plugins and validation are ready.

#### schema?

`TSchema`

Optional Zod schema used to validate `event.params`.

## Returns

[`Func`](../classes/Func.md)\<`Record`\<`string`, `unknown`\>, `unknown`, `Awaited`\<`ReturnType`\<`THandler`\>\>\>

## Throws

When the required `http` plugin is missing.

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
