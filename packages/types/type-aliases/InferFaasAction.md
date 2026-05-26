[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TApi\>

> **InferFaasAction**\<`TApi`\> = `TApi` _extends_ `object` ? `object` : `TApi` _extends_ `object` ? `TDefault` _extends_ `object` ? `object` : `never` : `never`

Infer `{ Params, Data }` from a Func, Func-like object, or a
module whose default export is a Func.

Peers into the handler signature of an API definition to extract:

- `Params` — resolved from the [event](https://faasjs.com/doc/func)
  argument of the handler via `event.params`.
- `Data` — resolved from the handler's return type.

Supports both direct Func exports and default-export patterns
(ESM `default` / CJS `module.exports`). Returns `never` when
inference fails.

## Type Parameters

### TApi

`TApi`

A Func, Func-like object, or module shape with a
`default` export.

## Returns

An object type with `Params` and `Data` properties
when inference succeeds, otherwise `never`.

## Example

```ts
import type { InferFaasAction } from '@faasjs/types'
import type * as loginApi from './user/login.func'

type LoginAction = InferFaasAction<typeof loginApi>
// → { Params: { email: string }; Data: { token: string } }
```

## See

- [FaasParams](FaasParams.md)
- [FaasData](FaasData.md)
