[@faasjs/core](../README.md) / InferPluginEvent

# Type Alias: InferPluginEvent\<TPlugins\>

> **InferPluginEvent**\<`TPlugins`\> = [`Simplify`](Simplify.md)\<`Record`\<`string`, `any`\> & [`UnionToIntersection`](UnionToIntersection.md)\<[`ResolvePluginEvent`](ResolvePluginEvent.md)\<`TPlugins`\[`number`\]\>\>\>

Infer event type from plugin type names.

## Type Parameters

### TPlugins

`TPlugins` *extends* readonly `string`[]

## Example

```ts
type Event = InferPluginEvent<['http']>
```
