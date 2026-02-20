[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options?`): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Request faas server

## Type Parameters

### PathOrData

`PathOrData` *extends* `FaasActionUnionType`

## Parameters

### action

`FaasAction`\<`PathOrData`\>

{string} action name

### params

`FaasParams`\<`PathOrData`\>

{object} action params

### options?

`Options`

## Returns

`Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

## Example

```ts
faas<{ title: string }>('post/get', { id: 1 }).then(res => {
  console.log(res.data.title)
})
```
