[@faasjs/types](../README.md) / FaasAction

# Type Alias: FaasAction\<T\>

> **FaasAction**\<`T`\> = `T` *extends* [`FaasActionPaths`](FaasActionPaths.md) ? `T` : `string`

Infer the action path type.

Returns the original type when `T` is a known action path,
otherwise falls back to `string`.

## Type Parameters

### T

`T` = `any`

## Example

```typescript
type A = FaasAction<'demo'> // 'demo'
type B = FaasAction<number> // string
```
