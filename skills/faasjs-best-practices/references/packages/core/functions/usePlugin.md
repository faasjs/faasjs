[@faasjs/core](../README.md) / usePlugin

# Function: usePlugin()

> **usePlugin**\<`T`\>(`plugin`): [`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<`T`\>

Register a plugin for the next [useFunc](useFunc.md) call and ensure it has a mount helper.

## Type Parameters

### T

`T` _extends_ [`Plugin`](../type-aliases/Plugin.md)

Plugin type to register and return.

## Parameters

### plugin

`T` & `object`

Plugin instance to register.

## Returns

[`UseifyPlugin`](../type-aliases/UseifyPlugin.md)\<`T`\>

The same plugin with a `mount()` convenience method.

## Example

```ts
import { useFunc, usePlugin } from '@faasjs/core'

export const func = useFunc(() => {
  usePlugin({
    name: 'trace',
    type: 'trace',
    async onInvoke(data, next) {
      data.logger.info('before handler')
      await next()
    },
  })

  return async () => 'ok'
})
```
