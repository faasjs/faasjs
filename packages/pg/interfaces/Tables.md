[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / Tables

# Interface: Tables

Consumer-extended table map used by `@faasjs/pg` declaration merging.

Extend this interface in application code with `declare module '@faasjs/pg'`.
Query builders then infer valid table names, columns, values, and selected row
shapes from the merged map. Unknown tables remain usable but fall back to
permissive `string` and `any` types.

## Example

```ts
import type { Tables } from '@faasjs/pg'

declare module '@faasjs/pg' {
  interface Tables {
    users: {
      id: string
      email: string
      metadata: { plan: string }
    }
  }
}
```
