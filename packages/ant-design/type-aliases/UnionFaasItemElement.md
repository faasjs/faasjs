[@faasjs/ant-design](../README.md) / UnionFaasItemElement

# Type Alias: UnionFaasItemElement\<Value, Values\>

> **UnionFaasItemElement**\<`Value`, `Values`\>: `ReactElement`\<[`UnionFaasItemInjection`](UnionFaasItemInjection.md)\<`Value`, `Values`\>\> \| `FC`\<[`UnionFaasItemInjection`](UnionFaasItemInjection.md)\<`Value`, `Values`\>\>

Represents a React element that is used in the UnionFaasItem context.

## Type Parameters

• **Value** = `any`

The type of the value associated with the element. Defaults to `any`.

• **Values** = `any`

The type of the values associated with the element. Defaults to `any`.

This type can either be a React element with the specified injection types or `null`.

## Example

```tsx
import { type UnionFaasItemElement, Form, Description, Table } from '@faasjs/ant-design'

const NameComponent: UnionFaasItemElement = ({ scene, value }) => {
  switch (scene) {
    switch (scene) {
    case 'form':
      return <input />
    case 'description':
    case 'table':
      return <span>{value}</span>
    default:
      return null
  }
}

const items = [
  {
   id: 'name',
   children: NameComponent // both `NameComponent` and `<NameComponent />` is valid
  }
]

function App() {
  return <>
   <Form items={items} /> // Will render an input
   <Description items={items} dataSource={{ name: 'John' }} /> // Will render a span
   <Table items={items} dataSource={[{ name: 'John' }]} /> // Will render a span
 </>
}
```
