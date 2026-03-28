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
setMock(async (action, params, options) => {
  if (action === 'user') {
    return { data: { name: 'John' } }
  }
  return { status: 404, data: { error: 'Not found' } }
})

const response = await client.action('user')
```

```ts
setMock({
  status: 200,
  data: { result: 'success' },
  headers: { 'X-Custom': 'value' },
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
setMock(null)
```

```ts
setMock(async () => {
  throw new Error('Internal error')
})
// This will reject with ResponseError
```
