[@faasjs/ant-design](../README.md) / FaasReactClient

# Function: FaasReactClient()

> **FaasReactClient**(`options?`): `FaasReactClientInstance`

Create and register a FaasReactClient instance.

The returned client is stored by `baseUrl` and becomes the default client
used by helpers such as [faas](faas.md) and [useFaas](useFaas.md).

## Parameters

### options?

[`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md) = `...`

Client configuration including base URL, default request options, and error hooks.

## Returns

`FaasReactClientInstance`

Registered FaasReactClient instance.

## Example

```ts
import { FaasReactClient, ResponseError } from '@faasjs/react'

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
```
