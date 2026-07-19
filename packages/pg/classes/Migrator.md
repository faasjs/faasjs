[**@faasjs/pg**](../README.md)

[@faasjs/pg](../README.md) / Migrator

# Class: Migrator

The `Migrator` class is responsible for handling database migrations.
It provides methods to check migration status, apply migrations, and roll back migrations.

Migration files are loaded from the configured folder with lexical filename ordering.
Each file should export `up(builder)` and optionally `down(builder)` functions that
receive a [SchemaBuilder](SchemaBuilder.md). Builder changes, including raw SQL statements, are
executed inside `SchemaBuilder.run()` transactions.

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

The table uses the migration filename without `.ts` as its primary key.

#### Returns

`Promise`\<`any`[]\>

### down()

> **down**(): `Promise`\<`undefined`>>>>\>

Rolls back the last applied migration by calling its `down` function.

If no migration history exists or the matching migration file is missing, the
method logs and returns without modifying the tracking table.

#### Returns

`Promise`\<`undefined`\>

A rejected promise if the rollback fails.

### migrate()

> **migrate**(): `Promise`\<`undefined`>>>>\>

Runs all pending migration files in lexical order.

Each migration file is loaded dynamically and its `up` function is invoked
with a [SchemaBuilder](SchemaBuilder.md). Changes are run in a transaction per migration.
Already-recorded migrations are skipped. When the folder has no `.ts` files,
the method logs and returns without throwing.

#### Returns

`Promise`\<`undefined`\>

### status()

> **status**(): `Promise`\<`any`[]\>

Returns all applied migration records from the tracking table.

Creates `faasjs_pg_migrations` first if needed.

#### Returns

`Promise`\<`any`[]\>

### up()

> **up**(): `Promise`\<`undefined`>>>>\>

Runs the next pending migration, if one exists.

The "next" file is the first lexical filename greater than the latest recorded
migration name. When there are no files or no pending migration, the method logs
and returns without throwing.

#### Returns

`Promise`\<`undefined`\>

A rejected promise if the migration fails.
