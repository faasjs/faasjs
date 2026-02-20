[@faasjs/react](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions** = `object`

## Properties

### baseUrl?

> `optional` **baseUrl**: [`BaseUrl`](BaseUrl.md)

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
