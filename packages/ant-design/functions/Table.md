[@faasjs/ant-design](../README.md) / Table

# Function: Table()

> **Table**\<`T`, `ExtendTypes`\>(`props`): `Element` \| `null`

Table component with Ant Design & FaasJS

- Based on [Ant Design Table](https://ant.design/components/table/).
- Support FaasJS injection.
- Auto generate filter dropdown (disable with `filterDropdown: false`).
- Auto generate sorter (disable with `sorter: false`).

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `any`\>

Row record type rendered by the table.

### ExtendTypes

`ExtendTypes` = `any`

Additional item prop shape accepted by `items`.

## Parameters

### props

[`TableProps`](../type-aliases/TableProps.md)\<`T`, `ExtendTypes`\>

Table props including columns, data source, and optional Faas data config.

## Returns

`Element` \| `null`

## Example

```tsx
import { Table } from '@faasjs/ant-design'

const rows = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
]

<Table
  rowKey="id"
  dataSource={rows}
  items={[
    { id: 'name', title: 'Name' },
    { id: 'active', type: 'boolean', title: 'Active' },
  ]}
/>
```
