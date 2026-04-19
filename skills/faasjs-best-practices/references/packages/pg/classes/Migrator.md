[@faasjs/pg](../README.md) / Migrator

# Class: Migrator

The `Migrator` class is responsible for handling database migrations.
It provides methods to check migration status, apply migrations, and roll back migrations.

## Param

The options for the migrator.

## Param

The database client.

## Param

The folder containing migration files.

## Constructors

### Constructor

> **new Migrator**(`options`): `Migrator`

#### Parameters

##### options

###### client

[`Client`](Client.md)

###### folder

`string`

#### Returns

`Migrator`

## Methods

### createMigrationTable()

> **createMigrationTable**(): `Promise`\<`any`[]\>

#### Returns

`Promise`\<`any`[]\>

### down()

> **down**(): `Promise`\<`undefined`\>

#### Returns

`Promise`\<`undefined`\>

### migrate()

> **migrate**(): `Promise`\<`undefined`\>

#### Returns

`Promise`\<`undefined`\>

### status()

> **status**(): `Promise`\<`any`[]\>

#### Returns

`Promise`\<`any`[]\>

### up()

> **up**(): `Promise`\<`undefined`\>

#### Returns

`Promise`\<`undefined`\>
