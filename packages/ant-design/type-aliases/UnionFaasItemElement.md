[@faasjs/ant-design](../README.md) / UnionFaasItemElement

# Type Alias: UnionFaasItemElement\<Value, Values\>

> **UnionFaasItemElement**\<`Value`, `Values`\> = `ReactElement`\<[`UnionFaasItemInjection`](UnionFaasItemInjection.md)\<`Value`, `Values`\>\> \| `FC`\<[`UnionFaasItemInjection`](UnionFaasItemInjection.md)\<`Value`, `Values`\>\>

Custom React component or element accepted by union item definitions.

## Type Parameters

### Value

`Value` = `any`

Current item value type.

### Values

`Values` = `any`

Whole record or row type that contains the value.

## Example

```tsx
import { type UnionFaasItemElement, Form, Description, Table } from '@faasjs/ant-design'

const NameComponent: UnionFaasItemElement = ({ scene, value }) => {
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
    children: NameComponent, // both `NameComponent` and `<NameComponent />` are valid
  },
]

function App() {
  return (
    <>
      <Form items={items} />
      <Description items={items} dataSource={{ name: 'John' }} />
      <Table items={items} dataSource={[{ name: 'John' }]} />
    </>
  )
}
```
