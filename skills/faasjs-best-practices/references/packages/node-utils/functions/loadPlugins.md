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

## Parameters

### func

`TFunc`

### options

[`LoadPluginsOptions`](../type-aliases/LoadPluginsOptions.md)

## Returns

`Promise`\<`TFunc`\>
