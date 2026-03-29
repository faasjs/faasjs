[@faasjs/react](../README.md) / setMock

# Function: setMock()

> **setMock**(`handler`): `void`

Set the global mock handler used by all [FaasBrowserClient](../classes/FaasBrowserClient.md) instances.

## Parameters

### handler

[`Response`](../classes/Response.md)\<`any`\> \| [`ResponseProps`](../type-aliases/ResponseProps.md)\<`any`\> \| [`MockHandler`](../type-aliases/MockHandler.md) \| `null` \| `undefined`

Mock handler, can be:

- MockHandler function: receives (action, params, options) and returns response data
- ResponseProps object: static response data
- Response instance: pre-configured Response object
- null or undefined: clear mock

## Returns

`void`

## Examples

```ts
import { afterEach } from 'vitest'

afterEach(() => {
  setMock(null)
})
```

```ts
setMock({
  data: { name: 'FaasJS' },
})

setMock({
  status: 500,
  data: { message: 'Internal Server Error' },
})
```

```ts
setMock(async (action) => {
  if (action === '/pages/users/get') {
    return { data: { id: 1, name: 'FaasJS' } }
  }

  return { status: 404, data: { message: 'Not Found' } }
})

const response = await client.action('/pages/users/get')
```

```ts
setMock(async (action, params) => {
  if (action === '/pages/users/get' && params?.id === 1) {
    return { data: { id: 1, name: 'Admin' } }
  }

  if (action === '/pages/users/get' && params?.id === 2) {
    return { data: { id: 2, name: 'Editor' } }
  }

  return { status: 404, data: { message: 'User not found' } }
})
```

```ts
setMock(
  new Response({
    status: 200,
    data: { result: 'success' },
  }),
)
```

```ts
setMock({
  body: new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('hello'))
      controller.enqueue(new TextEncoder().encode(' world'))
      controller.close()
    },
  }),
})
```

```ts
setMock(null)
```

```ts
setMock(async () => {
  throw new Error('Internal error')
})
// This will reject with ResponseError
```
