[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Request faas server

## Type parameters

• **PathOrData** extends `Record`\<`string`, `any`\>

## Parameters

• **action**: `string` \| `PathOrData`

{string} action name

• **params**: `FaasParams`\<`PathOrData`\>

{object} action params

## Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

## Example

```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```
