[@faasjs/react](../README.md) / FaasParams

# Type Alias: FaasParams\<T\>

> **FaasParams**\<`T`\> = `T` *extends* `FaasActionPaths` ? `FaasActions`\[`T`\]\[`"Params"`\] : `Record`\<`string`, `any`\>

Infer params type by action path.

## Type Parameters

### T

`T` = `any`

## Example

```typescript
type DemoParams = FaasParams<'demo'>
```
