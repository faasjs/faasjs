[@faasjs/dev](../README.md) / testApi

# Function: testApi()

> **testApi**\<`TFunc`\>(`initBy`): `TestApiHandler`\<`TFunc`\>

Create a callable JSON test handler around a FaasJS API.

The returned function forwards to [ApiTester.JSONhandler](../classes/ApiTester.md#jsonhandler) so it keeps
the same `(body, options?)` calling style while still exposing bound tester
methods for advanced cases.

## Type Parameters

### TFunc

`TFunc` _extends_ [`Func`](../classes/Func.md)\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Parameters

### initBy

`TFunc` \| \{ `default?`: `TFunc`; `func?`: `TFunc`; \}

API instance or module object to wrap.

## Returns

`TestApiHandler`\<`TFunc`\>

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
