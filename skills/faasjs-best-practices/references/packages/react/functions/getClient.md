[@faasjs/react](../README.md) / getClient

# Function: getClient()

> **getClient**(`host?`): [`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Get a registered FaasReactClient instance.

When `host` is omitted, the first registered client is returned. If no client
has been created yet, a default client is initialized automatically.

## Parameters

### host?

`string`

Registered base URL to look up. Omit it to use the default client.

## Returns

[`FaasReactClientInstance`](../type-aliases/FaasReactClientInstance.md)

Registered or newly created FaasReactClient instance.

## Example

```ts
import { getClient } from '@faasjs/react'

getClient()
getClient('http://localhost:8080/api/')
```
