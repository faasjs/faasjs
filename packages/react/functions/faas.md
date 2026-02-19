[@faasjs/react](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<[`Response`](../interfaces/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Request faas server

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

## Parameters

### action

[`FaasAction`](../type-aliases/FaasAction.md)\<`PathOrData`\>

{string} action name

### params

[`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

{object} action params

### options?

[`Options`](../type-aliases/Options.md)

## Returns

`Promise`\<[`Response`](../interfaces/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

## Example

```ts
faas<{ title: string }>('post/get', { id: 1 }).then((res) => {
  console.log(res.data.title)
})
```
