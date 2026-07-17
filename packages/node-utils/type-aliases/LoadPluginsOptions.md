[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / LoadPluginsOptions

# Type Alias: LoadPluginsOptions

> **LoadPluginsOptions** = `object`

Options used by [loadPlugins](../functions/loadPlugins.md) while resolving staged plugin config.

## Properties

### filename

> **filename**: `string`

API filename whose directory scopes nested config lookup and relative plugin paths.

### logger?

> `optional` **logger?**: [`Logger`](../classes/Logger.md)

Optional logger used for debug output during config and plugin loading.

### root

> **root**: `string`

Project root used to discover and merge `faas.yaml`.

### staging

> **staging**: `string`

Staging name such as `development` or `production`.
