[@faasjs/browser](../README.md) / setMock

# Function: setMock()

> **setMock**(`handler`): `void`

Set mock handler for testing

## Parameters

### handler

[`MockHandler`](../type-aliases/MockHandler.md)

mock handler, set `null` or `undefined` to clear mock

## Returns

`void`

## Example

```ts
import { setMock } from '@faasjs/browser'

setMock(async (action, params, options) => {
  return {
    status: 200,
    data: {
      name: 'FaasJS'
    }
  }
})

const client = new FaasBrowserClient('/')

const response = await client.action('path') // response.data.name === 'FaasJS'
```
