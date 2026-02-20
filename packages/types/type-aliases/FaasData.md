[@faasjs/types](../README.md) / FaasData

# Type Alias: FaasData\<T\>

> **FaasData**\<`T`\> = `T` *extends* [`FaasActionPaths`](FaasActionPaths.md) ? `FaasActions`\[`T`\]\[`"Data"`\] : `T` *extends* `Record`\<`string`, `any`\> ? `T` : `Record`\<`string`, `any`\>

Infer response data type by action path.

If `T` is already a plain object type, it is returned directly.

## Type Parameters

### T

`T` = `any`

## Example

```typescript
type DemoData = FaasData<'demo'>
type CustomData = FaasData<{ value: number }> // { value: number }
```
