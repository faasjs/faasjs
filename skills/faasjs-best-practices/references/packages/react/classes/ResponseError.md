[@faasjs/react](../README.md) / ResponseError

# Class: ResponseError

Custom error class for handling HTTP response errors from FaasJS requests.

Extends the built-in Error class to provide additional information about failed requests,
including HTTP status code, response headers, response body, and the original error.

## Examples

```ts
throw new ResponseError('User not found')
// or inside action method:
catch (error) {
  throw new ResponseError(error.message)
}
```

```ts
try {
  await someOperation()
} catch (error) {
  throw new ResponseError(error, {
    status: 500,
    headers: { 'X-Error-Type': 'internal' },
  })
}
```

```ts
throw new ResponseError({
  message: 'Validation failed',
  status: 400,
  headers: { 'X-Error-Code': 'VALIDATION_ERROR' },
  body: {
    error: {
      message: 'Validation failed',
      fields: ['email', 'password'],
    },
  },
})
```

```ts
try {
  const response = await client.action('user', { id: 123 })
  console.log(response.data)
} catch (error) {
  if (error instanceof ResponseError) {
    console.error(`Request failed: ${error.message}`)
    console.error(`Status: ${error.status}`)
    if (error.body) {
      console.error('Error details:', error.body)
    }
    if (error.headers['x-faasjs-request-id']) {
      console.error('Request ID:', error.headers['x-faasjs-request-id'])
    }
  }
}
```

```ts
setMock(async (action, params) => {
  if (action === 'login') {
    if (!params.email || !params.password) {
      throw new ResponseError({
        message: 'Email and password are required',
        status: 400,
        body: { error: 'missing_fields' },
      })
    }
    return { data: { token: 'abc123' } }
  }
})
```

Notes:

- ResponseError is automatically thrown by the action method when the server returns an error (status >= 400)
- The error message from server responses is extracted from body.error.message if available
- When created from an Error object, the original error is preserved in the originalError property
- The status property defaults to 500 if not explicitly provided
- Use instanceof ResponseError to distinguish FaasJS errors from other JavaScript errors
- The body property can contain structured error information from the server response

## See

- [FaasBrowserClient.action](FaasBrowserClient.md#action) for how ResponseError is thrown in requests.
- [ResponseProps](../type-aliases/ResponseProps.md) for the structure of response data.
- [setMock](../functions/setMock.md) for mocking errors in tests.

## Extends

- `Error`

## Constructors

### Constructor

> **new ResponseError**(`data`, `options?`): `ResponseError`

Create a ResponseError from a message, Error, or structured response error payload.

#### Parameters

##### data

`string` \| `Error`

Error message, Error object, or structured response error props.

`string`

`Error`

##### options?

`Omit`\<[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md), `"message"` \| `"originalError"`\>

Additional options such as status, headers, and body.

#### Returns

`ResponseError`

ResponseError instance.

#### Overrides

`Error.constructor`

### Constructor

> **new ResponseError**(`data`): `ResponseError`

#### Parameters

##### data

[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md)

#### Returns

`ResponseError`

#### Overrides

`Error.constructor`

## Properties

### body

> `readonly` **body**: `any`

The response body containing error details or the original error if available.

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

The response headers from the failed request.

### originalError?

> `readonly` `optional` **originalError?**: `Error`

The original Error object if this ResponseError was created from another Error.

### status

> `readonly` **status**: `number`

The HTTP status code of the failed response. Defaults to 500 if not provided.
