[@faasjs/react](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions**: `object`

## Type declaration

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

#### Default

`/`

### onError?

> `optional` **onError**: [`OnError`](OnError.md)

#### Example

```ts
onError: (action, params) => async (res) => {
  console.error(action, params, res)
}
```

### options?

> `optional` **options**: [`Options`](Options.md)
