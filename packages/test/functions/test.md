[@faasjs/test](../README.md) / test

# Function: test()

> **test**(`initBy`): [`FuncWarper`](../classes/FuncWarper.md)

A simple way to warp a FaasJS function.

## Parameters

• **initBy**: `string` \| [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

{string | Func} Full file path or a FaasJs function

```ts
import { test } from '@faasjs/test'

const func = test(__dirname + '/../demo.func.ts')

expect(await func.handler()).toEqual('Hello, world')
```

## Returns

[`FuncWarper`](../classes/FuncWarper.md)
