[@faasjs/dev](../README.md) / test

# Function: test()

> **test**\<`TFunc`\>(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

Create a [FuncWarper](../classes/FuncWarper.md) for tests.

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS function type.

## Parameters

### initBy

`TFunc`

FaasJS function module or exported function instance.

## Returns

[`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

## Example

```ts
import { test } from '@faasjs/dev'
import { func } from './hello.func'

const wrapped = test(func)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```
