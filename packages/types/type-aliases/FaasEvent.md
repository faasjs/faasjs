[@faasjs/types](../README.md) / FaasEvent

# Type Alias: FaasEvent\<T\>

> **FaasEvent**\<`T`\> = `T` *extends* [`FaasEventPaths`](FaasEventPaths.md) ? `FaasEvents`\[`T`\] : `Record`\<`string`, `any`\>

Infer event payload type by event path.

## Type Parameters

### T

`T` = `any`

## Example

```typescript
type DemoEvent = FaasEvent<'demo'>
```
