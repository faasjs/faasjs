[@faasjs/react](../README.md) / FaasReactClient

# Function: FaasReactClient()

> **FaasReactClient**(`__namedParameters?`): [`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Before use faas, you should initialize a FaasReactClient.

## Parameters

### \_\_namedParameters?

[`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md) = `...`

## Returns

[`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

FaasReactClient instance.

## Example

```ts
const client = FaasReactClient({
  baseUrl: 'localhost:8080/api/'
})
```
