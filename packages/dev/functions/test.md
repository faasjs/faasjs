[@faasjs/dev](../README.md) / test

# Function: test()

> **test**\<`TFunc`\>(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>

Create a [FuncWarper](../classes/FuncWarper.md) for tests.

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

## Parameters

### initBy

`TFunc`

FaasJS function module or exported function instance.

```ts
import { test } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = test(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Returns

[`FuncWarper`](../classes/FuncWarper.md)\<`TFunc`\>
