[@faasjs/react](../README.md) / FaasReactClient

# Function: FaasReactClient()

> **FaasReactClient**(`options?`): [`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Create and register a FaasReactClient instance.

The returned client is stored by `baseUrl` and becomes the default client
used by helpers such as [faas](faas.md) and [useFaas](useFaas.md). The instance-bound
`faas` and `useFaas` helpers inject this `baseUrl` when request options do
not provide one; the instance-bound `FaasDataWrapper` is always bound to this
`baseUrl`.

## Parameters

### options?

[`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md) = `...`

Client configuration including base URL, default request options, and error hooks.

## Returns

[`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Registered FaasReactClient instance.

## Example

```ts
import { FaasReactClient, ResponseError } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'features/users/api/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'features/users/api/get'

const client = FaasReactClient({
  baseUrl: 'http://localhost:8080/api/',
  onError: (action, params) => async (res) => {
    if (res instanceof ResponseError) {
      reportErrorToSentry(res, {
        tags: { action },
        extra: { params },
      })
    }
  },
})

const response = await client.faas<GetUserAction>('features/users/api/get', { id: 1 })
```
