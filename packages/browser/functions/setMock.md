[@faasjs/browser](../README.md) / setMock

# Function: setMock()

> **setMock**(`handler`): `void`

Set global mock handler for testing. Mock affects all FaasBrowserClient instances.

## Parameters

### handler

Mock handler, can be:
  - MockHandler function: receives (action, params, options) and returns response data
  - ResponseProps object: static response data
  - Response instance: pre-configured Response object
  - null or undefined: clear mock

[`Response`](../classes/Response.md)\<`any`\> | [`ResponseProps`](../type-aliases/ResponseProps.md)\<`any`\> | [`MockHandler`](../type-aliases/MockHandler.md)

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
  headers: { 'X-Custom': 'value' }
})
```

```ts
setMock(new Response({
  status: 200,
  data: { result: 'success' }
}))
```

```ts
setMock(null)
// or
setMock(undefined)
```

```ts
setMock(async () => {
  throw new Error('Internal error')
})
// This will reject with ResponseError
```
