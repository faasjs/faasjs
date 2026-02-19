[@faasjs/ant-design](../README.md) / UnionFaasItemRender

# Type Alias: UnionFaasItemRender()\<Value, Values\>

> **UnionFaasItemRender**\<`Value`, `Values`\> = (`value`, `values`, `index`, `scene`) => `React.ReactNode`

A type representing a function that renders a React node for a given item in a list.

## Type Parameters

### Value

`Value` = `any`

### Values

`Values` = `any`

## Parameters

### value

`Value`

The value of the current item.

### values

`Values`

The entire list of values.

### index

`number`

The index of the current item in the list.

### scene

[`UnionScene`](UnionScene.md)

[UnionScene](UnionScene.md) - The scene in which the rendering is taking place.

## Returns

`React.ReactNode`

## Example

```tsx
import { type UnionFaasItemRender, Form, Description, Table } from '@faasjs/ant-design'

const nameReader: UnionFaasItemRender = (value, values, index, scene) => {
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
    render: nameReader,
  },
]

function App() {
  return (
    <>
      <Form items={items} /> // Will render an input
      <Description items={items} dataSource={{ name: 'John' }} /> // Will render a span
      <Table items={items} dataSource={[{ name: 'John' }]} /> // Will render a span
    </>
  )
}
```
