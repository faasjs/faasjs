[**@faasjs/node-utils**](../README.md)

[@faasjs/node-utils](../README.md) / loadPlugins

# Function: loadPlugins()

> **loadPlugins**\<`T`>>>>>>\>(`func`, `options`): `Promise`\<`T`>>>>>>\>

Load staged `faas.yaml`, attach the merged config to a function, and
instantiate any plugins declared in YAML that are not already injected in code.

YAML plugin config is merged with `func.config.plugins`, with inline function
config winning. Existing plugin instances with the same `name` receive the
merged config through `applyConfig()` when available, otherwise their
`config` object is deep-merged. Missing plugin instances are loaded from the
resolved plugin `type` and inserted before the handler plugin when one exists.

Only `http` receives a built-in default type. Other config-driven plugins
must declare an explicit module `type`. Plain names resolve to `@faasjs/<type>`,
`http` resolves to `@faasjs/core`, and relative, absolute, `file://`, or other
URL-scheme specifiers are imported directly after path normalization.

Config-driven plugin modules must expose a plugin class as `export default`
with `onMount` or `onInvoke` on its prototype; named exports are not used as a
fallback.

## Type Parameters

### T

`T` _extends_ `object`

Function instance type enriched with config-driven plugins.

## Parameters

### func

`T`

Function instance whose config and plugin list should be updated.

### options

[`LoadPluginsOptions`](../type-aliases/LoadPluginsOptions.md)

## Returns

`Promise`\<`T`\>

The same function instance after plugin config and instances are applied.

## Throws

If plugin config is invalid, a plugin module cannot be loaded, or the plugin cannot be instantiated.

## Example

```ts
import { Func } from '@faasjs/core'
import { loadPlugins } from '@faasjs/node-utils'

const func = await loadPlugins(
  new Func({
    async handler() {
      return 'ok'
    },
  }),
  {
    root: process.cwd(),
    filename: '/project/src/hello.api.ts',
    staging: 'development',
  },
)
```
