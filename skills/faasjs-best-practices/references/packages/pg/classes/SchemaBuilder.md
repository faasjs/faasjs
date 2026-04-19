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

#### Returns

`SchemaBuilder`

## Methods

### alterTable()

> **alterTable**(`tableName`, `callback`): `SchemaBuilder`

#### Parameters

##### tableName

`string`

##### callback

(`table`) => `void`

#### Returns

`SchemaBuilder`

### createTable()

> **createTable**(`tableName`, `callback`): `SchemaBuilder`

#### Parameters

##### tableName

`string`

##### callback

(`table`) => `void`

#### Returns

`SchemaBuilder`

### dropTable()

> **dropTable**(`tableName`): `SchemaBuilder`

#### Parameters

##### tableName

`string`

#### Returns

`SchemaBuilder`

### raw()

> **raw**(`sql`): `SchemaBuilder`

#### Parameters

##### sql

`string`

#### Returns

`SchemaBuilder`

### renameTable()

> **renameTable**(`oldTableName`, `newTableName`): `SchemaBuilder`

#### Parameters

##### oldTableName

`string`

##### newTableName

`string`

#### Returns

`SchemaBuilder`

### run()

> **run**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### toSQL()

> **toSQL**(): `string`[]

#### Returns

`string`[]
