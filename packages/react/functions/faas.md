[@faasjs/react](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`): `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

Request faas server

## Type parameters

• **PathOrData** extends `Record`\<`string`, `any`\>

## Parameters

• **action**: `string` \| `PathOrData`

\{string\} action name

• **params**: [`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

\{object\} action params

## Returns

`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](../type-aliases/FaasData.md)\<`PathOrData`\>\>\>

## Example

```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```
