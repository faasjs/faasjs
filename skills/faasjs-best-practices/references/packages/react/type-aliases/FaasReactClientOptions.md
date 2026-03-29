[@faasjs/react](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions** = `object`

Options for creating a [FaasReactClient](../functions/FaasReactClient.md) instance.

## Properties

### baseUrl?

> `optional` **baseUrl?**: [`BaseUrl`](BaseUrl.md)

#### Default

`/`

### onError?

> `optional` **onError?**: [`OnError`](OnError.md)

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

> `optional` **options?**: [`Options`](Options.md)

Default request options forwarded to the underlying browser client.
