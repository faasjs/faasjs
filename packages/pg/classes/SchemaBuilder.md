[@faasjs/pg](../README.md) / SchemaBuilder

# Class: SchemaBuilder

Builds and executes schema changes against a [Client](Client.md).

Accumulated statements are executed in a single transaction by [run](#run).

## Constructors

### Constructor

> **new SchemaBuilder**(`client`): `SchemaBuilder`

#### Parameters

##### client

[`Client`](Client.md)

The database client used to execute schema changes.

#### Returns

`SchemaBuilder`

## Methods

### alterTable()

> **alterTable**(`tableName`, `callback`): `SchemaBuilder`

Registers one or more ALTER TABLE statements. The callback receives a [TableBuilder](TableBuilder.md)
scoped to the given table name in alter mode.

#### Parameters

##### tableName

`string`

The name of the table to alter.

##### callback

(`table`) => `void`

A function that defines the alterations.

#### Returns

`SchemaBuilder`

### createTable()

> **createTable**(`tableName`, `callback`): `SchemaBuilder`

Registers a CREATE TABLE statement. The callback receives a [TableBuilder](TableBuilder.md)
scoped to the given table name in create mode.

#### Parameters

##### tableName

`string`

The name of the table to create.

##### callback

(`table`) => `void`

A function that defines the table schema.

#### Returns

`SchemaBuilder`

### dropTable()

> **dropTable**(`tableName`): `SchemaBuilder`

Registers a DROP TABLE statement.

#### Parameters

##### tableName

`string`

The name of the table to drop.

#### Returns

`SchemaBuilder`

### raw()

> **raw**(`sql`): `SchemaBuilder`

Appends a raw SQL statement to the change list.

#### Parameters

##### sql

`string`

The raw SQL to execute.

#### Returns

`SchemaBuilder`

### renameTable()

> **renameTable**(`oldTableName`, `newTableName`): `SchemaBuilder`

Registers a table rename statement.

#### Parameters

##### oldTableName

`string`

The current table name.

##### newTableName

`string`

The new table name.

#### Returns

`SchemaBuilder`

### run()

> **run**(): `Promise`\<`void`\>

Executes all registered schema changes in a single database transaction.

#### Returns

`Promise`\<`void`\>

#### Throws

Wrapped with the full SQL on failure.

### toSQL()

> **toSQL**(): `string`[]

Serializes all registered schema changes into an array of SQL statement strings.

#### Returns

`string`[]

The array of generated SQL statements.
