[@faasjs/react](../README.md) / getClient

# Function: getClient()

> **getClient**(`host?`): [`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Get a registered FaasReactClient instance.

When `host` is omitted, the first registered client is returned. If no client
has been created yet, a default client is initialized automatically.
Use `getClient` only for special cases such as multiple Faas clients with
different base URLs. In normal single-client app code, prefer the default
`faas`, `useFaas`, or `FaasReactClient` setup directly.

## Parameters

### host?

`string`

Registered base URL to look up. Omit it to use the default client.

## Returns

[`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Registered or newly created FaasReactClient instance.

## Example

```ts
import { FaasReactClient, getClient } from '@faasjs/react'

FaasReactClient({
  baseUrl: 'https://service-a.example.com/api/',
})

FaasReactClient({
  baseUrl: 'https://service-b.example.com/api/',
})

const client = getClient('https://service-b.example.com/api/')

await client.faas('/pages/posts/get', { id: 1 })
```
