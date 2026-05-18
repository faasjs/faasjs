[@faasjs/react](../README.md) / FaasReactClientInstance

# Type Alias: FaasReactClientInstance

> **FaasReactClientInstance** = `object`

Public interface returned by [FaasReactClient](../functions/FaasReactClient.md).

## Properties

### browserClient

> **browserClient**: [`FaasBrowserClient`](../classes/FaasBrowserClient.md)

Underlying browser client used for the actual HTTP requests.

### faas

> **faas**: *typeof* [`faas`](../functions/faas.md)

Promise-based request helper bound to the registered base URL.

### FaasDataWrapper

> **FaasDataWrapper**: *typeof* [`FaasDataWrapper`](../variables/FaasDataWrapper.md)

Wrapper component bound to the registered base URL.

### id

> **id**: `string`

Unique identifier inherited from the underlying browser client.

### onError?

> `optional` **onError?**: [`OnError`](OnError.md)

Optional error hook shared by `faas` and `useFaas`.

### useFaas

> **useFaas**: *typeof* [`useFaas`](../functions/useFaas.md)

Hook bound to the registered base URL.
