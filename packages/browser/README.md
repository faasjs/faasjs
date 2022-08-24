# @faasjs/browser

FaasJS browser client.

**If you use React or Vue, please use [@faasjs/react](https://faasjs.com/doc/react) or [@faasjs/vue-plugin](https://faasjs.com/doc/vue-plugin).**

[![License: MIT](https://img.shields.io/npm/l/@faasjs/browser.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/browser/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/browser/stable.svg)](https://www.npmjs.com/package/@faasjs/browser)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/browser/beta.svg)](https://www.npmjs.com/package/@faasjs/browser)

Browser plugin for FaasJS.

## Install

    npm install @faasjs/browser

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

Reference: [Default Query Function | TanStack Query](https://tanstack.com/query/v4/docs/guides/default-query-function)

## Modules

### Classes

- [FaasBrowserClient](classes/FaasBrowserClient.md)
- [Response](classes/Response.md)
- [ResponseError](classes/ResponseError.md)

### Type Aliases

- [FaasBrowserClientAction](#faasbrowserclientaction)
- [Options](#options)
- [ResponseHeaders](#responseheaders)

## Type Aliases

### FaasBrowserClientAction

Ƭ **FaasBrowserClientAction**: <PathOrData\>(`action`: `PathOrData` \| `string`, `params?`: `FaasParams`<`PathOrData`\>, `options?`: [`Options`](#options)) => `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

#### Type declaration

▸ <`PathOrData`\>(`action`, `params?`, `options?`): `Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends `FaasAction` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `PathOrData` \| `string` |
| `params?` | `FaasParams`<`PathOrData`\> |
| `options?` | [`Options`](#options) |

##### Returns

`Promise`<[`Response`](classes/Response.md)<`FaasData`<`PathOrData`\>\>\>

___

### Options

Ƭ **Options**: `RequestInit` & { `beforeRequest?`: (`{
    action, params, options
  }`: { `action`: `string` ; `options`: [`Options`](#options) ; `params`: `Record`<`string`, `any`\>  }) => `Promise`<`void`\> \| `void` ; `headers?`: { `[key: string]`: `string`;  }  }

___

### ResponseHeaders

Ƭ **ResponseHeaders**: `Object`

#### Index signature

▪ [key: `string`]: `string`
