[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TFunc\>

> **InferFaasAction**\<`TFunc`\> = `TFunc` _extends_ `object` ? `object` : `never`

Infer the FaasAction type from a Func.

## Type Parameters

### TFunc

`TFunc` _extends_ `FaasFuncLike`

## Example

```typescript
import { defineApi, z } from '@faasjs/core'
import type { InferFaasAction } from '@faasjs/types'

const schema = z
  .object({
    number: z.number(),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ params }) {
    if (!params) throw Error('params is required')

    return params.number + 1
  },
})

// declare the action type to FaasActions
declare module '@faasjs/types' {
  interface FaasActions {
    // if 'demo' is the action path
    demo: InferFaasAction<typeof func>
  }
}
```
