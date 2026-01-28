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

## Stream Support

### Use Native Stream

Set `stream: true` to get native fetch Response with ReadableStream:

```ts
import { FaasBrowserClient } from '@faasjs/browser'

const client = new FaasBrowserClient('/')

const response = await client.action('chat', { prompt }, { stream: true })

const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  console.log('Chunk:', chunk)
}
```

### Abort Streaming

Use AbortController to cancel streaming:

```ts
const controller = new AbortController()

const response = await client.action('chat', { prompt }, {
  stream: true,
  signal: controller.signal
})

controller.abort()
```

### Custom Parser

Parse streaming data with custom logic:

```ts
const response = await client.action('chat', { prompt }, { stream: true })
const reader = response.body.getReader()
const decoder = new TextDecoder()
let fullText = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)

  if (chunk.startsWith('data: ')) {
    const json = JSON.parse(chunk.slice(6))
    fullText += json.content
  }
}
```

**Note**: When `stream: true`, returns native Response object, not FaasJS Response wrapper.

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
