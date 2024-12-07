[@faasjs/ant-design](../README.md) / faas

# Function: faas()

> **faas**\<`PathOrData`\>(`action`, `params`, `options`?): `Promise`\<`Response`\<`FaasData`\<`PathOrData`\>\>\>

Request faas server

## Type Parameters

• **PathOrData** *extends* `FaasAction`

## Parameters

### action

{string} action name

`string` | `PathOrData`

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
