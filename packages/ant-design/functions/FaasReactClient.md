[@faasjs/ant-design](../README.md) / FaasReactClient

# Function: FaasReactClient()

> **FaasReactClient**(`options?`): `FaasReactClientInstance`

Create and register a FaasReactClient for an Ant Design app.

Use this entrypoint in apps that also use [App](App.md) so `faas`, `useFaas`, and
`useFaasStream` share the same configured client and error feedback behavior.

## Parameters

### options?

[`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md)

Client configuration including base URL, default request options, and error hooks.

## Returns

`FaasReactClientInstance`

Registered FaasReactClient instance.

## Example

```ts
import { FaasReactClient } from '@faasjs/ant-design'

FaasReactClient({ baseUrl: '/api/' })
```
