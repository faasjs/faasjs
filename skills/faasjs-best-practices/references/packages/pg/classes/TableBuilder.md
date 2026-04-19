[@faasjs/pg](../README.md) / TableBuilder

# Class: TableBuilder

## Constructors

### Constructor

> **new TableBuilder**(`tableName`, `mode`): `TableBuilder`

#### Parameters

##### tableName

`string`

##### mode

`TableBuilderMode`

#### Returns

`TableBuilder`

## Methods

### alterColumn()

> **alterColumn**(`name`, `changes`): `TableBuilder`

#### Parameters

##### name

`string`

##### changes

`Partial`\<`ColumnDefinition`\>

#### Returns

`TableBuilder`

### boolean()

> **boolean**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### date()

> **date**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### dropColumn()

> **dropColumn**(`name`): `TableBuilder`

#### Parameters

##### name

`string`

#### Returns

`TableBuilder`

### dropIndex()

> **dropIndex**(`columns`): `TableBuilder` \| `undefined`

#### Parameters

##### columns

`string` \| `string`[]

#### Returns

`TableBuilder` \| `undefined`

### index()

> **index**(`columns`, `options?`): `TableBuilder`

#### Parameters

##### columns

`string` \| `string`[]

##### options?

`Omit`\<`IndexDefs`, `"columns"`\> = `{}`

#### Returns

`TableBuilder`

### json()

> **json**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### jsonb()

> **jsonb**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### number()

> **number**(`name`, `precision?`, `scale?`): `ColumnBuilder`

#### Parameters

##### name

`string`

##### precision?

`number`

##### scale?

`number`

#### Returns

`ColumnBuilder`

### raw()

> **raw**(`sql`): `TableBuilder`

#### Parameters

##### sql

`string`

#### Returns

`TableBuilder`

### renameColumn()

> **renameColumn**(`from`, `to`): `TableBuilder`

#### Parameters

##### from

`string`

##### to

`string`

#### Returns

`TableBuilder`

### specificType()

> **specificType**(`name`, `type`): `ColumnBuilder`

#### Parameters

##### name

`string`

##### type

`string`

#### Returns

`ColumnBuilder`

### string()

> **string**(`name`, `length?`): `ColumnBuilder`

#### Parameters

##### name

`string`

##### length?

`number`

#### Returns

`ColumnBuilder`

### timestamp()

> **timestamp**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### timestamps()

> **timestamps**(): `TableBuilder`

#### Returns

`TableBuilder`

### timestamptz()

> **timestamptz**(`name`): `ColumnBuilder`

#### Parameters

##### name

`string`

#### Returns

`ColumnBuilder`

### toSQL()

> **toSQL**(): `string`[]

#### Returns

`string`[]
