[**@faasjs/types**](../README.md)

[@faasjs/types](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`> > > > \> = `FaasActionValue`\<`T`, `"Data"`>>>>\>

Infer the response data type for a given action path.

When `T` matches a declared [action path](FaasActionPaths.md),
resolves to `FaasActions[T]['Data']`. Falls back to
`Record<string, unknown>` for explicit unrecognized string paths.
Returns `never` when `T` is not a string; the bare `FaasData` default uses
`unknown`, so it also resolves to `never`.

## Type Parameters

### T

`T` = `unknown`

Candidate action path or response data type.

## Returns

`FaasActions[T]['Data']` when `T` is a registered action
path, `Record<string, unknown>` for any unregistered string,
or `never` when `T` is not a string.

## Example

```ts
// Registered action — resolves to the declared Data type
type LoginData = FaasData<'user/login'>
// → { token: string }

// Unregistered string — falls back to a generic record
type UnknownData = FaasData<'some/action'>
// → Record<string, unknown>

// Non-string — resolves to never
type Invalid = FaasData<42>
// → never
```

## See

- [FaasActionPaths](FaasActionPaths.md)
- [FaasParams](FaasParams.md)
