[@faasjs/node-utils](../README.md) / FuncPluginConfig

# Type Alias: FuncPluginConfig

> **FuncPluginConfig** = `object`

Per-plugin configuration entry resolved from `faas.yaml`.

## Example

```ts
const pluginConfig: FuncPluginConfig = {
  type: 'http',
  config: {
    path: '/orders/create',
  },
}
```

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### config?

> `optional` **config?**: `object`

Plugin-specific configuration payload.

#### Index Signature

\[`key`: `string`\]: `any`

### name?

> `optional` **name?**: `string`

Plugin key assigned during config resolution.

### type?

> `optional` **type?**: `string`

Plugin type identifier consumed by the runtime or plugin loader.
