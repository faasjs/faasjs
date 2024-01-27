# @faasjs/browser

FaasJS browser client.

**If you use React or Vue, please use [@faasjs/react](https://faasjs.com/doc/react) or [@faasjs/vue-plugin](https://faasjs.com/doc/vue-plugin).**

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/browser.svg)](https://www.npmjs.com/package/@faasjs/browser)

Browser plugin for FaasJS.

## Install

```sh
npm install @faasjs/browser
```

## Use directly

```ts
import { FaasBrowserClient } from '@faasjs/browser'

const client = new FaasBrowserClient('/')

await client.action('func', { key: 'value' })
```

## Use with SWR

```ts
import { FaasBrowserClient } from '@faasjs/browser'
import useSWR from 'swr'

const client = new FaasBrowserClient('/')

const { data } = useSWR(['func', { key: 'value' }], client.action)
```

Reference: [Data Fetching - SWR](https://swr.vercel.app/docs/data-fetching)

## Use with React Query

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

## Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

## Type Aliases

- [FaasBrowserClientAction](type-aliases/FaasBrowserClientAction.md)
- [MockHandler](type-aliases/MockHandler.md)
- [Options](type-aliases/Options.md)
- [ResponseHeaders](type-aliases/ResponseHeaders.md)

## Functions

- [generateId](functions/generateId.md)
- [setMock](functions/setMock.md)
