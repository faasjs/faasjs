[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / TableBuilder

# Class: TableBuilder

Builder for table schema definitions, supporting both CREATE and ALTER TABLE modes.

Column definitions and alterations are accumulated and then serialized to SQL
via [toSQL](#tosql). Generated identifiers are escaped; raw SQL added with [raw](#raw)
is emitted unchanged and should only contain trusted schema text.

## Constructors

### Constructor

> **new TableBuilder**(`tableName`, `mode`): `TableBuilder`

#### Parameters

##### tableName

`string`

The name of the table.

##### mode

`TableBuilderMode`

Whether to produce CREATE TABLE or ALTER TABLE statements.

#### Returns

`TableBuilder`

## Methods

### alterColumn()

> **alterColumn**(`name`, `changes`): `TableBuilder`

Alters an existing column. In `create` mode this mutates the pending definition.
In `alter` mode this stages ALTER COLUMN operations.

#### Parameters

##### name

`string`

The column name to alter.

##### changes

`Partial`\<`ColumnDefinition`\>

The partial column definition with changes to apply.

#### Returns

`TableBuilder`

### boolean()

> **boolean**(`name`): `ColumnBuilder`

Defines a `boolean` column.

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### date()

> **date**(`name`): `ColumnBuilder`

Defines a `date` column.

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### dropColumn()

> **dropColumn**(`name`): `TableBuilder`

Drops a column. In `create` mode this removes it from the pending definition.
In `alter` mode this stages a DROP COLUMN operation.

#### Parameters

##### name

`string`

The column name to drop.

#### Returns

`TableBuilder`

### dropIndex()

> **dropIndex**(`columns`): `TableBuilder` \| `undefined`

Drops an index previously defined by [index](#index). The index name must match
the auto-generated naming convention `idx_{tableName}_{columns}`.

#### Parameters

##### columns

`string` \| `string`[]

The same column(s) originally passed to [index](#index).

#### Returns

`TableBuilder` \| `undefined`

### index()

> **index**(`columns`, `options?`): `TableBuilder`

Creates an index on one or more columns. The index name is auto-generated as
`idx_{tableName}_{columns}`.

Reusing the same generated name replaces the pending in-memory index definition.

#### Parameters

##### columns

`string` \| `string`[]

Single column name or array of column names.

##### options?

`Omit`\<`IndexDefs`, `"columns"`\> = `{}`

Index options such as `unique` and `indexType`.

#### Returns

`TableBuilder`

### json()

> **json**(`name`): `ColumnBuilder`

Defines a `json` column.

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### jsonb()

> **jsonb**(`name`): `ColumnBuilder`

Defines a `jsonb` column.

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### number()

> **number**(`name`, `precision?`, `scale?`): `ColumnBuilder`

Defines an `integer` column, or `decimal(precision, scale)` if precision is provided.

When `precision` is provided and `scale` is omitted, the scale defaults to `0`.

#### Parameters

##### name

`string`

The column name.

##### precision?

`number`

Optional decimal precision.

##### scale?

`number`

Optional decimal scale.

#### Returns

`ColumnBuilder`

### raw()

> **raw**(`sql`): `TableBuilder`

Appends a raw SQL fragment to the generated output.

The fragment is emitted unchanged after generated table and index SQL. Only pass
static, trusted schema SQL.

#### Parameters

##### sql

`string`

The raw SQL to include.

#### Returns

`TableBuilder`

### renameColumn()

> **renameColumn**(`from`, `to`): `TableBuilder`

Renames a column. In `create` mode this renames it in the pending definition.
In `alter` mode this stages a RENAME COLUMN operation.

#### Parameters

##### from

`string`

The current column name.

##### to

`string`

The new column name.

#### Returns

`TableBuilder`

### specificType()

> **specificType**(`name`, `type`): `ColumnBuilder`

Defines a column with an explicit PostgreSQL type.

Use this for types not covered by the convenience helpers, such as arrays or
extension-provided types.

#### Parameters

##### name

`string`

The column name.

##### type

`string`

The PostgreSQL type string (e.g. `'integer'`, `'varchar(255)'`).

#### Returns

`ColumnBuilder`

### string()

> **string**(`name`, `length?`): `ColumnBuilder`

Defines a `varchar` column, optionally with a maximum length.

#### Parameters

##### name

`string`

The column name.

##### length?

`number`

Optional maximum length.

#### Returns

`ColumnBuilder`

### timestamp()

> **timestamp**(`name`): `ColumnBuilder`

Defines a `timestamp` column (without timezone).

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### timestamps()

> **timestamps**(): `TableBuilder`

Adds `created_at` and `updated_at` `timestamptz` columns with a default of `now()`.

#### Returns

`TableBuilder`

### timestamptz()

> **timestamptz**(`name`): `ColumnBuilder`

Defines a `timestamptz` column (with timezone).

#### Parameters

##### name

`string`

The column name.

#### Returns

`ColumnBuilder`

### toSQL()

> **toSQL**(): `string`[]

Serializes the table builder state into an array of SQL statement strings.

#### Returns

`string`[]

The generated SQL statements.
