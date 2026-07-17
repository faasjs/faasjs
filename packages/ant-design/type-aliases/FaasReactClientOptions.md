[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions** = `object`

Options for creating a [FaasReactClient](../functions/FaasReactClient.md) instance.

## Properties

### baseUrl?

> `optional` **baseUrl?**: `BaseUrl`

Base URL used as the registry key for this client and as the default prefix
for bound `faas` and `useFaas` calls.

#### Default

`/`

### onError?

> `optional` **onError?**: `OnError`

Error hook invoked when `faas` or `useFaas` receives a failed response.

#### Example

```ts
import { ResponseError } from '@faasjs/react'

onError: (action, params) => async (res) => {
  if (res instanceof ResponseError) {
    reportErrorToSentry(res, {
      tags: { action },
      extra: { params },
    })
  }
}
```

### options?

> `optional` **options?**: `Options`

Default request options forwarded to the underlying browser client.
