[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / setMock

# Function: setMock()

> **setMock**(`handler`): `void`

Set the global mock handler used by all [FaasBrowserClient](../classes/FaasBrowserClient.md) instances.

When a mock handler is set, every [FaasBrowserClient.action](../classes/FaasBrowserClient.md#action) call will
route through the mock after `beforeRequest` runs and before any native
`fetch` or custom `request` implementation is called. The mock is process
global, so it affects every registered React/browser client until cleared.

## Parameters

### handler

[`Response`](../classes/Response.md)\<`any`\> \| [`MockHandler`](../type-aliases/MockHandler.md) \| [`ResponseProps`](../type-aliases/ResponseProps.md) \| `null` \| `undefined`

A mock function that receives `(action, params, options)` and returns a
response shape, a [Response](../classes/Response.md), an `Error`, or nothing. Static
response shapes and `Response` instances are also accepted. Pass `null` or
`undefined` to disable mocking.

## Returns

`void`

## Example

```ts
import { setMock, Response } from '@faasjs/react'

// Mock all requests with a static response
setMock({ data: { name: 'test' } })

// Mock with a handler function
setMock(async (action, params) => {
  if (action === 'posts/get') {
    return { data: { title: 'Hello' } }
  }
  return new Error('Not found')
})

// Disable mocking
setMock(null)
```
