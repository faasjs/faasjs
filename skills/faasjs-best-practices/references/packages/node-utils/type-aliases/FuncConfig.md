[@faasjs/node-utils](../README.md) / FuncConfig

# Type Alias: FuncConfig

> **FuncConfig** = `object`

Resolved stage config merged from matching `faas.yaml` files.

## Example

```ts
const config: FuncConfig = {
  plugins: {
    http: {
      type: 'http',
    },
  },
}
```

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### plugins?

> `optional` **plugins?**: `object`

Named plugin configs keyed by plugin name.

#### Index Signature

\[`key`: `string`\]: [`FuncPluginConfig`](FuncPluginConfig.md)
