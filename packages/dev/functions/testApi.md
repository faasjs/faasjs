[@faasjs/dev](../README.md) / testApi

# Function: testApi()

> **testApi**\<`TApi`>>>>\>(`api`): [`TestApiHandler`](../type-aliases/TestApiHandler.md)\<`TApi`>>>>\>

Create a callable JSON test handler around a FaasJS API.

The returned function forwards to [ApiTester.JSONhandler](../classes/ApiTester.md#jsonhandler) so it keeps
the same `(body, options?)` calling style while still exposing bound tester
methods for advanced cases. Detached `handler`, `JSONhandler`, and `mount`
references remain bound to the underlying tester instance.

## Type Parameters

### TApi

`TApi` _extends_ `Func`\<`any`, `any`, `any`\>

Wrapped FaasJS API type.

## Parameters

### api

`TApi`

API instance to wrap.

## Returns

[`TestApiHandler`](../type-aliases/TestApiHandler.md)\<`TApi`\>

Callable JSON test helper with bound tester methods attached.

## See

[ApiTester](../classes/ApiTester.md)

## Example

```ts
import { testApi } from '@faasjs/dev'
import api from './hello.api'

const handler = testApi(api)
const response = await handler({ name: 'FaasJS' }, { session: { userId: '1' } })

expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```
