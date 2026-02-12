[@faasjs/dev](../README.md) / test

# Function: test()

> **test**(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)

A simple way to wrap a FaasJS function.

## Parameters

### initBy

[`Func`](../classes/Func.md)

{Func} Full file path or a FaasJs function

```ts
import { test } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = test(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Returns

[`FuncWarper`](../classes/FuncWarper.md)
