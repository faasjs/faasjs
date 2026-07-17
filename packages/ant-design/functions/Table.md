[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / Table

# Function: Table()

> **Table**\<`T`, `ExtendTypes`>>>>>>\>(`props`): `Element`

Render an Ant Design table from FaasJS item metadata.

The component can render local `dataSource` rows or resolve remote rows through `faasData`. It
also generates default filters and sorters for built-in item types unless you disable them with
the corresponding Ant Design column props. Remote list endpoints should return
`{ rows, pagination }` when the table should send pagination, filters, and sorters
back through `reload()`; a plain array response is rendered as rows without that
remote list contract.

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

`Element`

## Throws

When an entry in `extendTypes` omits both `children` and `render`.

## Example

```tsx
import { Table } from '@faasjs/ant-design'
import type { TableFaasDataParams, TableFaasDataResponse } from '@faasjs/ant-design'

const rows = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
]

export function UserTable() {
  return (
    <Table
      rowKey="id"
      dataSource={rows}
      items={[
        { id: 'name', title: 'Name' },
        { id: 'active', type: 'boolean', title: 'Active' },
      ]}
    />
  )
}

declare module '@faasjs/types' {
  interface FaasActions {
    'users/list': {
      Params: TableFaasDataParams & { status?: string }
      Data: TableFaasDataResponse<{ id: number; name: string; active: boolean }>
    }
  }
}

export function RemoteUserTable() {
  return (
    <Table<{ id: number; name: string; active: boolean }>
      rowKey="id"
      faasData={{
        action: 'users/list',
        params: { pagination: { current: 1, pageSize: 20 } },
      }}
      items={[
        { id: 'name', title: 'Name' },
        { id: 'active', type: 'boolean', title: 'Active' },
      ]}
    />
  )
}
```
