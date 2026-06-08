[@faasjs/node-utils](../README.md) / FuncPluginConfig

# Type Alias: FuncPluginConfig

> **FuncPluginConfig** = `object`

Per-plugin configuration entry resolved from `faas.yaml`.

Relative `type` values found in YAML are normalized from the directory that
contains that `faas.yaml`. `npm:` prefixes are stripped before the type is
consumed by plugin loading.

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

This is copied from the plugin map key during config resolution.

### type?

> `optional` **type?**: `string`

Plugin type identifier consumed by the runtime or plugin loader.

`http` is the only built-in type defaulted by [loadPlugins](../functions/loadPlugins.md); other
YAML-driven plugins need an explicit type.
