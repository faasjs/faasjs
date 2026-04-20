[@faasjs/dev](../README.md) / test

# Function: test()

> **test**\<`TFunc`\>(`initBy`): [`ApiTester`](../classes/ApiTester.md)\<`TFunc`\>

Create a bound [ApiTester](../classes/ApiTester.md) for tests.

The returned wrapper binds `mount()`, `handler()`, and `JSONhandler()` so
they can be passed around without losing their instance context.

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Parameters

### initBy

`TFunc` \| \{ `default?`: `TFunc`; `func?`: `TFunc`; \}

API instance passed to [ApiTester](../classes/ApiTester.md).

## Returns

[`ApiTester`](../classes/ApiTester.md)\<`TFunc`\>

Bound wrapper instance.

## See

[ApiTester](../classes/ApiTester.md)

## Example

```ts
import { test } from '@faasjs/dev'
import api from './hello.api.ts'

const wrapped = test(api)

const response = await wrapped.JSONhandler({ name: 'FaasJS' })
```
