[@faasjs/browser](../README.md) / Response

# Class: Response\<T\>

Wrapper class for HTTP responses from FaasJS functions.

Provides a consistent interface for handling server responses with status code, headers,
body, and parsed data. Automatically handles JSON serialization and status code defaults.

## Param

Response properties including status, headers, body, and data.
All properties are optional with sensible defaults.

## Remarks

- status defaults to 200 if data or body is present, 204 otherwise
- body is automatically populated from data if not explicitly provided
- headers defaults to an empty object if not provided
- Use generic type parameter T for type-safe data access
- Commonly used as the return type from client.action() method
- Can be used in mock handlers to return structured responses
- The data property is optional and may be undefined for responses without data

## Examples

```ts
const response = new Response({
  status: 200,
  data: {
    id: 123,
    name: 'John Doe',
  },
})
console.log(response.status) // 200
console.log(response.data.name) // 'John Doe'
```

```ts
interface User {
  id: number
  name: string
  email: string
}

const response = new Response<User>({
  data: {
    id: 123,
    name: 'John',
    email: 'john@example.com',
  },
})
// TypeScript knows response.data.name is a string
```

```ts
const response = new Response({
  status: 201,
  data: { created: true },
  headers: {
    'Content-Type': 'application/json',
    'X-Request-Id': 'req-123',
    'X-Cache-Key': 'user-123',
  },
})
```

```ts
const response = new Response({
  status: 200,
  body: JSON.stringify({ custom: 'format' }),
  headers: { 'Content-Type': 'application/json' },
})
```

```ts
const response = new Response()
// status: 204, headers: {}, body: undefined, data: undefined
```

```ts
const response = new Response({
  status: 404,
  data: {
    error: {
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    },
  },
})
```

```ts
setMock(async (action, params) => {
  if (action === 'user') {
    return new Response({
      status: 200,
      data: { id: params.id, name: 'Mock User' },
    })
  }
  return new Response({ status: 404, data: { error: 'Not found' } })
})
```

## See

- ResponseProps for response property type
- ResponseError for error response handling
- FaasBrowserClient.action for method returning Response

## Type Parameters

### T

`T` = `any`

The type of the data property for type-safe response handling

## Constructors

### Constructor

> **new Response**\<`T`\>(`props?`): `Response`\<`T`\>

#### Parameters

##### props?

[`ResponseProps`](../type-aliases/ResponseProps.md)\<`T`\> = `{}`

#### Returns

`Response`\<`T`\>

## Properties

### body

> `readonly` **body**: `any`

The raw response body as a string or object.
If data is provided without body, body is automatically set to JSON.stringify(data).

### data?

> `readonly` `optional` **data**: `T`

The parsed JSON data from the response.
Optional property that contains the response payload when JSON is provided.

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

The response headers as a key-value object.
Empty object if no headers were provided.

### status

> `readonly` **status**: `number`

The HTTP status code of the response.
Defaults to 200 if data or body is provided, 204 if neither is present.
