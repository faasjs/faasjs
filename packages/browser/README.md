# @faasjs/browser

FaasJS browser client.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/browser/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/browser.svg)](https://www.npmjs.com/package/@faasjs/browser)

Browser plugin for FaasJS.

## Install

```sh
npm install @faasjs/browser
```

## Usage

### Use directly

```ts
import { FaasBrowserClient } from '@faasjs/browser'

const client = new FaasBrowserClient('/')

await client.action('func', { key: 'value' })
```

### Use with SWR

```ts
import { FaasBrowserClient } from '@faasjs/browser'
import useSWR from 'swr'

const client = new FaasBrowserClient('/')

const { data } = useSWR(['func', { key: 'value' }], client.action)
```

Reference: [Data Fetching - SWR](https://swr.vercel.app/docs/data-fetching)

### Use with React Query

```ts
import { FaasBrowserClient } from '@faasjs/browser'
import { QueryClient } from 'react-query'

const client = new FaasBrowserClient('/')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => client
        .action(queryKey[0] as string, queryKey[1] as any)
        .then(data => data.data),
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}
```

### Use with React

Please use [@faasjs/react](https://faasjs.com/doc/react/) for React.

## Error Handling

FaasJS throws [ResponseError](classes/ResponseError.md) when API requests fail. You can catch these errors
to handle different scenarios like network errors, server errors, or validation errors.

The [ResponseError](classes/ResponseError.md) class provides additional information about the failed request,
including the HTTP status code, response headers, and the full response body.

## Examples

```ts
import { FaasBrowserClient, ResponseError } from '@faasjs/browser'

const client = new FaasBrowserClient('https://api.example.com/')

try {
  const response = await client.action('user', { id: 123 })
  console.log(response.data)
} catch (error) {
  if (error instanceof ResponseError) {
    console.error(`Request failed with status ${error.status}`)
    console.error(`Error message: ${error.message}`)
    console.error('Response body:', error.body)

    if (error.status === 404) {
      console.log('Resource not found')
    } else if (error.status >= 500) {
      console.log('Server error, please try again later')
    }
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Mock for Testing

Use the global [setMock](functions/setMock.md) function to mock API calls during tests. This allows you
to test your application without making actual network requests.

Mocks are useful for:

- Unit testing client-side logic
- Integration testing with predictable responses
- Testing error handling scenarios
- Offline development

```ts
import { FaasBrowserClient, setMock, ResponseError } from '@faasjs/browser'

// Set up a mock function
setMock(async (action, params) => {
  if (action === 'user') {
    // Return a successful response
    return { data: { id: params.id, name: 'Mock User' } }
  } else if (action === 'error') {
    // Throw an error to test error handling
    throw new ResponseError('Not found', 404, {
      body: { message: 'User not found' },
    })
  }
})

// Create client - it will use the mock
const client = new FaasBrowserClient('https://api.example.com/')

// This will use the mock and return the mocked data
const response = await client.action('user', { id: 123 })
console.log(response.data) // { id: 123, name: 'Mock User' }
```

## API Reference

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md) - Main client class for making API requests to FaasJS functions
- [Response](classes/Response.md) - Response wrapper class containing status, headers, body, and data
- [ResponseError](classes/ResponseError.md) - Custom error class for handling API request failures

### Types

- [Options](type-aliases/Options.md) - Request options type for customizing client behavior
- [ResponseProps](type-aliases/ResponseProps.md) - Response properties type for constructing Response objects
- [ResponseHeaders](type-aliases/ResponseHeaders.md) - Headers type representing HTTP response headers
- [BaseUrl](type-aliases/BaseUrl.md) - Base URL type with trailing slash requirement
- [MockHandler](type-aliases/MockHandler.md) - Mock handler function type for testing
- [FaasBrowserClientAction](type-aliases/FaasBrowserClientAction.md) - Action method type definition

### Functions

- [setMock](functions/setMock.md) - Global mock function for intercepting API calls during testing

## Functions

- [generateId](functions/generateId.md)
- [setMock](functions/setMock.md)

## Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

## Type Aliases

- [BaseUrl](type-aliases/BaseUrl.md)
- [FaasBrowserClientAction](type-aliases/FaasBrowserClientAction.md)
- [MockHandler](type-aliases/MockHandler.md)
- [Options](type-aliases/Options.md)
- [ResponseErrorProps](type-aliases/ResponseErrorProps.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)
- [ResponseProps](type-aliases/ResponseProps.md)
