[@faasjs/dev](../README.md) / testApi

# Function: testApi()

> **testApi**\<`TApi`\>(`api`): `TestApiHandler`\<`TApi`\>

Create a callable JSON test handler around a FaasJS API.

The returned function forwards to [ApiTester.JSONhandler](../classes/ApiTester.md#jsonhandler) so it keeps
the same `(body, options?)` calling style while still exposing bound tester
methods for advanced cases.

## Type Parameters

### TApi

`TApi` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Parameters

### api

`TApi`

API instance to wrap.

## Returns

`TestApiHandler`\<`TApi`\>

Callable JSON test helper with bound tester methods attached.

## See

[ApiTester](../classes/ApiTester.md)

## Example

```ts
import { testApi } from '@faasjs/dev'
import api from './hello.api.ts'

const handler = testApi(api)
const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })

expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```
