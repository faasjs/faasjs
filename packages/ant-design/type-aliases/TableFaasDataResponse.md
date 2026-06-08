[@faasjs/ant-design](../README.md) / TableFaasDataResponse

# Type Alias: TableFaasDataResponse\<T\>

> **TableFaasDataResponse**\<`T`\> = `object`

Paginated list response shape expected by [Table](../functions/Table.md) when using `faasData`.

Return this object shape when the table should own remote pagination, filters,
and sorters. Returning a plain array is supported for simple row rendering,
but it does not attach the remote pagination/onChange reload contract.

## Type Parameters

### T

`T` = `any`

Row record type contained in `rows`.

## Properties

### pagination

> **pagination**: `object`

Pagination state returned by the endpoint.

#### current

> **current**: `number`

Current page number.

#### pageSize

> **pageSize**: `number`

Page size used for the result set.

#### total

> **total**: `number`

Total number of available rows.

### rows

> **rows**: `T`[]

Rows rendered by the table.
