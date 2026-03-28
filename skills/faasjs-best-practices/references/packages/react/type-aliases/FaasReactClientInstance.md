[@faasjs/react](../README.md) / FaasReactClientInstance

# Type Alias: FaasReactClientInstance

> **FaasReactClientInstance** = `object`

Public interface returned by [FaasReactClient](../functions/FaasReactClient.md).

## Properties

### browserClient

> **browserClient**: [`FaasBrowserClient`](../classes/FaasBrowserClient.md)

Underlying browser client used for the actual HTTP requests.

### faas

> **faas**: _typeof_ [`faas`](../functions/faas.md)

Promise-based request helper bound to the registered base URL.

### FaasDataWrapper

> **FaasDataWrapper**: _typeof_ [`FaasDataWrapper`](../variables/FaasDataWrapper.md)

Wrapper component bound to the registered base URL.

### id

> **id**: `string`

Unique identifier inherited from the underlying browser client.

### onError?

> `optional` **onError?**: [`OnError`](OnError.md)

Optional error hook shared by `faas` and `useFaas`.

### useFaas

> **useFaas**: _typeof_ [`useFaas`](../functions/useFaas.md)

Hook bound to the registered base URL.
