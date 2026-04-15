[@faasjs/node-utils](../README.md) / loadPlugins

# Function: loadPlugins()

> **loadPlugins**\<`TFunc`\>(`func`, `options`): `Promise`\<`TFunc`\>

Load staged `faas.yaml`, attach the merged config to a function, and
instantiate any plugins declared in YAML that are not already injected in code.

Only `http` is treated as a built-in plugin. Other config-driven plugins must
declare an explicit module `type` whose default export is a lifecycle plugin
constructor.

## Type Parameters

### TFunc

`TFunc` _extends_ `Func`\<`any`, `any`, `any`\>

Function instance type enriched with config-driven plugins.

## Parameters

### func

`TFunc`

Function instance whose config and plugin list should be updated.

### options

[`LoadPluginsOptions`](../type-aliases/LoadPluginsOptions.md)

Project and staging metadata used to resolve plugin config.

## Returns

`Promise`\<`TFunc`\>

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
    filename: '/project/src/hello.func.ts',
    staging: 'development',
  },
)
```
