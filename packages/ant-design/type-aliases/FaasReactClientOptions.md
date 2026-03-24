[@faasjs/ant-design](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions** = `object`

Options for creating a [FaasReactClient](../functions/FaasReactClient.md) instance.

## Properties

### baseUrl?

> `optional` **baseUrl?**: `BaseUrl`

#### Default

`/`

### onError?

> `optional` **onError?**: `OnError`

Error hook invoked when `faas` or `useFaas` receives a failed response.

#### Example

```ts
onError: (action, params) => async (res) => {
  console.error(action, params, res)
}
```

### options?

> `optional` **options?**: `Options`

Default request options forwarded to the underlying browser client.
