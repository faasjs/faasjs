[@faasjs/dev](../README.md) / test

# Function: test()

> **test**\<`TFunc`\>(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

Create a bound [FuncWarper](../classes/FuncWarper.md) for tests.

The returned wrapper binds `mount()`, `handler()`, and `JSONhandler()` so
they can be passed around without losing their instance context.

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS function type.

## Parameters

### initBy

`TFunc`

Function instance passed to [FuncWarper](../classes/FuncWarper.md).

## Returns

[`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

Bound wrapper instance.

## See

[FuncWarper](../classes/FuncWarper.md)

## Example

```ts
import { test } from '@faasjs/dev'
import { func } from './hello.func'

const wrapped = test(func)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```
