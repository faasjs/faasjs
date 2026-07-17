[@faasjs/types](../README.md) / InferFaasAction

# Type Alias: InferFaasAction\<TApi\>

> **InferFaasAction**\<`TApi`> > > > \> = `InferFaasActionFromApi`\<`TApi`> > > > \> _extends_ `never` ? `TApi` _extends_ `object` ? `InferFaasActionFromApi`\<`TDefault`> > > > \> : `never` : `InferFaasActionFromApi`\<`TApi`>>>>\>

Infer `{ Params, Data }` from a FaasJS API object or a module whose default
export is a FaasJS API object.

Peers into the exported handler signature to extract:

- `Params` — resolved from the handler event's `params` field.
- `Data` — resolved from the handler's return type.

Supports direct API objects and module objects with an ESM `default` export.
Returns `never` when inference fails.

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
import type * as loginApi from './user/login.api'

type LoginAction = InferFaasAction<typeof loginApi>
// → { Params: { email: string }; Data: { token: string } }
```

## See

- [FaasParams](FaasParams.md)
- [FaasData](FaasData.md)
