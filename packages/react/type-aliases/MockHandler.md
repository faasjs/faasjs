[@faasjs/react](../README.md) / MockHandler

# Type Alias: MockHandler()

> **MockHandler** = (`action`, `params`, `options`) => `Promise`\<[`ResponseProps`](ResponseProps.md)\> \| `Promise`\<`void`\> \| `Promise`\<`Error`\>

Mock handler function type for testing FaasJS requests.

Defines the signature for functions that can mock API requests during testing.
Mock handlers receive request parameters and return simulated responses or errors.

## Parameters

### action

`string`

The function path/action being requested (e.g., 'user', 'data/list').
  Converted to lowercase by the client before being passed to the handler.

### params

The parameters passed to the action.
  May be undefined if the action was called without parameters.
  Parameters are passed as a plain object (already JSON-serialized if needed).

`Record`\<`string`, `any`\> | `undefined`

### options

[`Options`](Options.md)

The full request options including headers, beforeRequest hook, and other config.
  Includes X-FaasJS-Request-Id header in the headers object.
  Contains merged client defaults and per-request options.

## Returns

`Promise`\<[`ResponseProps`](ResponseProps.md)\> \| `Promise`\<`void`\> \| `Promise`\<`Error`\>

- A Promise resolving to:
  - ResponseProps: Mock response data (status, headers, body, data)
  - void: Returns an empty response (204 No Content)
  - Error: Throws ResponseError when returning an Error object

## Remarks

- Used by setMock() function to mock API calls during tests
- Affects all FaasBrowserClient instances when set globally
- Can return different responses based on action or params
- Returning an Error object causes the action() method to reject with ResponseError
- Async function - must return a Promise
- Receives the fully merged options including default headers

## Examples

```ts
setMock(async (action, params, options) => {
  if (action === 'user') {
    return {
      status: 200,
      data: { id: params.id, name: 'Mock User' }
    }
  }
  return { status: 404, data: { error: 'Not found' } }
})
```

```ts
setMock(async (action, params) => {
  if (action === 'login') {
    if (params.email === 'admin@example.com' && params.password === 'admin') {
      return { data: { token: 'admin-token', role: 'admin' } }
    }
    return { status: 401, data: { error: 'Invalid credentials' } }
  }
})
```

```ts
setMock(async (action) => {
  if (action === 'protected') {
    return new Error('Unauthorized access')
    // This will be wrapped in ResponseError and thrown
  }
})
```

```ts
setMock(async (action) => {
  if (action === 'delete') {
    // Return void for 204 No Content
    return
  }
  return { data: { success: true } }
})
```

## See

 - setMock for setting up mock handlers
 - ResponseProps for response structure
 - ResponseError for error handling
