[@faasjs/ant-design](../README.md) / TableFaasDataResponse

# Type Alias: TableFaasDataResponse\<T\>

> **TableFaasDataResponse**\<`T`\> = `object`

Paginated response shape expected by [Table](../functions/Table.md) when using `faasData`.

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
