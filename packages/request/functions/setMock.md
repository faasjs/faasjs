[@faasjs/request](../README.md) / setMock

# Function: setMock()

> **setMock**(`handler`): `void`

Mock requests

## Parameters

### handler

{function | null} null to disable mock

[`Mock`](../type-aliases/Mock.md) | `null`

## Returns

`void`

## Example

```ts
setMock(async (url, options) =>
  Promise.resolve({ headers: {}, statusCode: 200, body: { data: 'ok' } }),
)
```
