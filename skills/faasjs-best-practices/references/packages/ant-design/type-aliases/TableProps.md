[@faasjs/ant-design](../README.md) / TableProps

# Type Alias: TableProps\<T, ExtendTypes\>

> **TableProps**\<`T`, `ExtendTypes`\> = `object` & `AntdTableProps`\<`T`\>

Props for the FaasJS Ant Design [Table](../functions/Table.md) component.

## Type Declaration

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendTableTypeProps`](ExtendTableTypeProps.md)\<`any`\>

### faasData?

> `optional` **faasData?**: [`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`any`\>

Request config used to fetch table data before rendering.

### items

> **items**: ([`TableItemProps`](../interfaces/TableItemProps.md) \| `ExtendTypes` & [`ExtendTableItemProps`](ExtendTableItemProps.md))[]

Column definitions rendered by the table.

### onChange?

> `optional` **onChange?**: (`pagination`, `filters`, `sorter`, `extra`) => `object`

Change handler that can return rewritten pagination, filter, and sorter state.

#### Parameters

##### pagination

`TablePaginationConfig`

##### filters

`Record`\<`string`, `FilterValue` \| `null`\>

##### sorter

`SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]

##### extra

`TableCurrentDataSource`\<`T`\>

#### Returns

`object`

##### extra

> **extra**: `TableCurrentDataSource`\<`T`\>

##### filters

> **filters**: `Record`\<`string`, `FilterValue` \| `null`\>

##### pagination

> **pagination**: `TablePaginationConfig`

##### sorter

> **sorter**: `SorterResult`\<`T`\> \| `SorterResult`\<`T`\>[]

## Type Parameters

### T

`T` = `any`

Row record type rendered by the table.

### ExtendTypes

`ExtendTypes` = `any`

Additional item prop shape accepted by `items`.
