[@faasjs/dev](../README.md) / nameFunc

# Function: nameFunc()

> **nameFunc**\<`T`\>(`name`, `handler`): `T`

Assign a stable name to a function for logs and stack traces.

## Type Parameters

### T

`T` _extends_ (...`args`) => `any`

Function type to rename.

## Parameters

### name

`string`

Name assigned to `handler.name`.

### handler

`T`

Function to rename.

## Returns

`T`

The same handler with an updated `name` property.

## Example

```ts
import { nameFunc } from '@faasjs/core'

const handler = nameFunc('myHandler', () => 'Hello World')

console.log(handler.name) // => 'myHandler'
```
