[@faasjs/browser](../README.md) / FaasBrowserClient

# Class: FaasBrowserClient

Browser client for FaasJS - provides HTTP client functionality for making API requests from web applications.

## Template

Type parameter extending FaasActionUnionType for type-safe requests

Features:
- Type-safe API requests with TypeScript support
- Built-in mock support for testing
- Custom request function support
- Request/response hooks (beforeRequest)
- Automatic error handling with ResponseError
- Streaming support for large responses
- Multiple instance support with unique IDs

## Remarks

- All requests are POST requests by default
- Automatically adds X-FaasJS-Request-Id header for request tracking
- baseUrl must end with '/' (will throw Error if not)
- Supports global mock via setMock() for testing all instances

## Examples

```ts
import { FaasBrowserClient } from '@faasjs/browser'

const client = new FaasBrowserClient('http://localhost:8080/')
const response = await client.action('func', { key: 'value' })
console.log(response.data)
```

```ts
const client = new FaasBrowserClient('https://api.example.com/', {
  headers: { 'X-API-Key': 'secret' },
  beforeRequest: async ({ action, params, headers }) => {
    console.log(`Calling ${action} with params:`, params)
  }
})
```

```ts
const apiClient = new FaasBrowserClient('https://api.example.com/')
const localClient = new FaasBrowserClient('http://localhost:3000/')

const apiData = await apiClient.action('users')
const localData = await localClient.action('data')
```

```ts
const client = new FaasBrowserClient('https://api.example.com/')

try {
  const response = await client.action('user', { id: 123 })
  console.log(response.data)
} catch (error) {
  if (error instanceof ResponseError) {
    console.error(`Request failed: ${error.message}`, error.status)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Throws

When baseUrl does not end with '/'

## See

 - setMock for testing support
 - ResponseError for error handling

## Constructors

### Constructor

> **new FaasBrowserClient**(`baseUrl?`, `options?`): `FaasBrowserClient`

Creates a new FaasBrowserClient instance.

#### Parameters

##### baseUrl?

`` `${string}/` `` = `'/'`

Base URL for all API requests. Must end with '/'. Defaults to '/' for relative requests.

##### options?

[`Options`](../type-aliases/Options.md) = `...`

Configuration options for the client.
  Supports default headers, beforeRequest hook, custom request function,
  baseUrl override, and streaming mode.

#### Returns

`FaasBrowserClient`

#### Throws

If baseUrl does not end with '/'

#### Examples

```ts
const client = new FaasBrowserClient('/')
```

```ts
const client = new FaasBrowserClient('https://api.example.com/')
```

```ts
const client = new FaasBrowserClient('https://api.example.com/', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
})
```

```ts
const client = new FaasBrowserClient('https://api.example.com/', {
  beforeRequest: async ({ action, params, headers }) => {
    console.log(`Requesting ${action}`, params)
    // Modify headers before request
    headers['X-Timestamp'] = Date.now().toString()
  }
})
```

```ts
import axios from 'axios'

const client = new FaasBrowserClient('/', {
  request: async (url, options) => {
    const response = await axios.post(url, options.body, {
      headers: options.headers
    })
    return new Response({
      status: response.status,
      headers: response.headers,
      data: response.data
    })
  }
})
```

#### Throws

When baseUrl does not end with '/'

## Methods

### action()

> **action**\<`PathOrData`\>(`action`, `params?`, `options?`): `Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

Makes a request to a FaasJS function.

#### Type Parameters

##### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

The function path or data type for type safety

#### Parameters

##### action

`FaasAction`\<`PathOrData`\>

The function path to call. Converted to lowercase when constructing the URL.
  Must be a non-empty string.

##### params?

`FaasParams`\<`PathOrData`\>

The parameters to send to the function. Will be serialized as JSON.
  Optional if the function accepts no parameters.

##### options?

[`Options`](../type-aliases/Options.md)

Optional request options that override client defaults.
  Supports headers, beforeRequest hook, custom request function, baseUrl override, and streaming mode.

#### Returns

`Promise`\<[`Response`](Response.md)\<`FaasData`\<`PathOrData`\>\>\>

A Promise that resolves to a Response object containing status, headers, body, and data.
  The data property is typed based on the PathOrData generic parameter.

#### Throws

When action is not provided or is empty

#### Throws

When the server returns an error response (status >= 400 or body.error exists)

#### Throws

When network request fails

#### Remarks

- All requests are POST requests by default
- Action path is automatically converted to lowercase
- A unique request ID is generated for each request and sent in X-FaasJS-Request-Id header
- Headers are merged from client defaults and request options (request options take precedence)
- If a global mock is set via setMock(), it will be used instead of making real requests
- If a custom request function is provided in options, it will be used instead of fetch
- When stream option is true, returns the native fetch Response instead of a wrapped Response
- Response body is automatically parsed as JSON when possible
- Server errors (body.error) are automatically converted to ResponseError

#### Examples

```ts
const response = await client.action('user', { id: 123 })
console.log(response.data)
```

```ts
const response = await client.action('status')
console.log(response.data.status)
```

```ts
const response = await client.action('data', {
  limit: 10,
  offset: 0
}, {
  headers: { 'X-Custom-Header': 'value' }
})
```

```ts
const response = await client.action('stream', {
  format: 'json'
}, {
  stream: true
})
// response is native fetch Response with streaming support
const reader = response.body.getReader()
```

```ts
interface UserData {
  id: number
  name: string
  email: string
}

const response = await client.action<{
  action: 'user'
  params: { id: number }
  data: UserData
}>('user', { id: 123 })
console.log(response.data.name) // TypeScript knows it's a string
```

```ts
try {
  const response = await client.action('user', { id: 123 })
  console.log(response.data)
} catch (error) {
  if (error instanceof ResponseError) {
    console.error(`Server error: ${error.message}`, error.status)
    if (error.data) console.error('Error details:', error.data)
  } else {
    console.error('Network error:', error)
  }
}
```

```ts
const userId = await client.action('createUser', {
  name: 'John',
  email: 'john@example.com'
})

const profile = await client.action('getProfile', {
  userId: userId.data.id
})
```

## Properties

### baseUrl

> **baseUrl**: `` `${string}/` ``

### defaultOptions

> **defaultOptions**: [`Options`](../type-aliases/Options.md)

### id

> `readonly` **id**: `string`
