[@faasjs/ant-design](../README.md) / UnionFaasItemRender

# Type Alias: UnionFaasItemRender\<Value, Values\>

> **UnionFaasItemRender**\<`Value`, `Values`\> = (`value`, `values`, `index`, `scene`) => `React.ReactNode`

Render callback signature shared by form, description, and table item definitions.

## Type Parameters

### Value

`Value` = `any`

Current item value type.

### Values

`Values` = `any`

Whole record or row type that contains the value.

## Parameters

### value

`Value`

Current item value.

### values

`Values`

Whole record or row containing the value.

### index

`number`

Current row or list index.

### scene

[`UnionScene`](UnionScene.md)

Rendering surface requesting the output.

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
