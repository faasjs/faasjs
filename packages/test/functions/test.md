[@faasjs/test](../README.md) / test

# Function: test()

> **test**(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)

A simple way to warp a FaasJS function.

## Parameters

### initBy

[`Func`](../classes/Func.md)

{Func} Full file path or a FaasJs function

```ts
import { test } from '@faasjs/test'
import Func from '../demo.func.ts'

const func = test(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Returns

[`FuncWarper`](../classes/FuncWarper.md)
