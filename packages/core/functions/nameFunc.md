[@faasjs/core](../README.md) / nameFunc

# Function: nameFunc()

> **nameFunc**\<`T`\>(`name`, `handler`): `T`

Assigns a name to a given function handler, which will be displayed in logs and error messages.

## Type Parameters

### T

`T` *extends* (...`args`) => `any`

The type of the function handler.

## Parameters

### name

`string`

The name to assign to the function handler.

### handler

`T`

The function handler to which the name will be assigned.

## Returns

`T`

- The original function handler with the assigned name.

## Example

```ts
import { nameFunc } from '@faasjs/core'

const handler = nameFunc('myHandler', () => {
 return 'Hello World'
})

console.log(handler.name) // => 'myHandler'
```
