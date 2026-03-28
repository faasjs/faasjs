[@faasjs/ant-design](../README.md) / TableFaasDataParams

# Type Alias: TableFaasDataParams

> **TableFaasDataParams** = `object`

Query params shape expected by table-backed FaasJS endpoints.

## Properties

### filters?

> `optional` **filters?**: `Record`\<`string`, `any`[]\>

Active filter values keyed by column field.

### pagination?

> `optional` **pagination?**: `object`

Pagination state sent to the endpoint.

#### current?

> `optional` **current?**: `number`

Current page number.

#### pageSize?

> `optional` **pageSize?**: `number`

Requested page size.

### sorter?

> `optional` **sorter?**: \{ `field`: `string`; `order`: `"ascend"` \| `"descend"`; \} \| `object`[]

Sorter state sent to the endpoint.

#### Union Members

##### Type Literal

\{ `field`: `string`; `order`: `"ascend"` \| `"descend"`; \}

##### field

> **field**: `string`

Column field being sorted.

##### order

> **order**: `"ascend"` \| `"descend"`

Sort direction.

`object`[]
