[@faasjs/ant-design](../README.md) / FaasReactClientOptions

# Type Alias: FaasReactClientOptions

> **FaasReactClientOptions** = `object`

## Properties

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

#### Default

`/`

### onError?

> `optional` **onError**: `OnError`

#### Example

```ts
onError: (action, params) => async (res) => {
  console.error(action, params, res)
}
```

### options?

> `optional` **options**: `Options`
