[@faasjs/knex](../README.md) / KnexSchema

# Class: KnexSchema

Migration helper for FaasJS's knex plugin.

## Constructors

### Constructor

> **new KnexSchema**(`knex`): `KnexSchema`

#### Parameters

##### knex

###### adapter?

`Knex`\<`any`, `any`[]\>

###### config

`Config`

###### name

`string`

#### Returns

`KnexSchema`

## Methods

### migrateCurrentVersion()

> **migrateCurrentVersion**(): `Promise`\<`string`\>

#### Returns

`Promise`\<`string`\>

### migrateLatest()

> **migrateLatest**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### migrateMake()

> **migrateMake**(`name`): `Promise`\<`string`\>

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string`\>

### migrateRollback()

> **migrateRollback**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

### migrateStatus()

> **migrateStatus**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

## Properties

### knex

> `readonly` **knex**: `object`

#### adapter?

> `optional` **adapter**: `Knex`\<`any`, `any`[]\>

#### config

> **config**: `Config`

#### name

> **name**: `string`
