[@faasjs/types](../README.md) / InferFaasFunc

# Type Alias: InferFaasFunc\<TModule\>

> **InferFaasFunc**\<`TModule`\> = `TModule` *extends* `object` ? `TFunc` *extends* `FaasFuncLike` ? `TFunc` : `never` : `TModule` *extends* `object` ? `TFunc` *extends* `FaasFuncLike` ? `TFunc` : `never` : `never`

Infer the Func type from a module.

Supports both `export const func = defineApi(...)` and `export default defineApi(...)`.

## Type Parameters

### TModule

`TModule`

## Example

```typescript
import type { InferFaasAction, InferFaasFunc } from '@faasjs/types'

declare module '@faasjs/types' {
  interface FaasActions {
    demo: InferFaasAction<
      InferFaasFunc<typeof import('./functions/demo')>
    >
  }
}
```
