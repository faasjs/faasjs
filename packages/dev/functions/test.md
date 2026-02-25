[@faasjs/dev](../README.md) / test

# Function: test()

> **test**\<`TFunc`\>(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

A simple way to wrap a FaasJS function.

## Type Parameters

### TFunc

`TFunc` *extends* [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

## Parameters

### initBy

`TFunc`

{Func} Full file path or a FaasJs function

```ts
import { test } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = test(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Returns

[`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>
