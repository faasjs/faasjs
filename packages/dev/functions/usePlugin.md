[@faasjs/dev](../README.md) / usePlugin

# Function: usePlugin()

> **usePlugin**\<`T`\>(`plugin`): [`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<`T`\>

Register a plugin for the next [useFunc](useFunc.md) call and ensure it has a mount helper.

## Type Parameters

### T

`T` _extends_ [`Plugin`](../type-aliases/Plugin.md)

## Parameters

### plugin

`T` & `object`

Plugin instance to register.

## Returns

[`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<`T`\>

The same plugin with a `mount()` convenience method.
