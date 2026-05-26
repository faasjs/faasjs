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

Migration configuration.

###### client

[`Client`](Client.md)

The database client.

###### folder

`string`

The folder containing migration files.

#### Returns

`Migrator`

## Methods

### createMigrationTable()

> **createMigrationTable**(): `Promise`\<`any`[]\>

Creates the `faasjs_pg_migrations` tracking table if it does not exist.

#### Returns

`Promise`\<`any`[]\>

### down()

> **down**(): `Promise`\<`undefined`\>

Rolls back the last applied migration by calling its `down` function.

#### Returns

`Promise`\<`undefined`\>

A rejected promise if the rollback fails.

### migrate()

> **migrate**(): `Promise`\<`undefined`\>

Runs all pending migration files in lexical order.

Each migration file is loaded dynamically and its `up` function is invoked
with a [SchemaBuilder](SchemaBuilder.md). Changes are run in a transaction per migration.

#### Returns

`Promise`\<`undefined`\>

### status()

> **status**(): `Promise`\<`any`[]\>

Returns all applied migration records from the tracking table.

#### Returns

`Promise`\<`any`[]\>

### up()

> **up**(): `Promise`\<`undefined`\>

Runs the next pending migration, if one exists.

#### Returns

`Promise`\<`undefined`\>

A rejected promise if the migration fails.
