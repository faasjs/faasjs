[@faasjs/types](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`> > > > \> = `FaasActionValue`\<`T`, `"Params"`>>>>\>

Infer the params type for a given action path.

When `T` matches a declared [action path](FaasActionPaths.md),
resolves to `FaasActions[T]['Params']`. Falls back to
`Record<string, unknown>` for explicit unrecognized string paths.
Returns `never` when `T` is not a string; the bare `FaasParams` default uses
`unknown`, so it also resolves to `never`.

## Type Parameters

### T

`T` = `unknown`

Candidate action path or params type.

## Returns

`FaasActions[T]['Params']` when `T` is a registered action
path, `Record<string, unknown>` for any unregistered string,
or `never` when `T` is not a string.

## Example

```ts
// Registered action — resolves to the declared Params type
type LoginParams = FaasParams<'user/login'>
// → { email: string; password: string }

// Unregistered string — falls back to a generic record
type UnknownParams = FaasParams<'some/action'>
// → Record<string, unknown>

// Non-string — resolves to never
type Invalid = FaasParams<42>
// → never
```

## See

- [FaasActionPaths](FaasActionPaths.md)
- [FaasData](FaasData.md)
