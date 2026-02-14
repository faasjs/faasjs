[@faasjs/knex](../README.md) / createPgliteKnex

# Function: createPgliteKnex()

> **createPgliteKnex**(`config?`, `connection?`): `Promise`\<`Knex`\<`any`, `any`[]\>\>

Create a knex instance backed by `knex-pglite`.
If connection is missing, it defaults to an in-memory database.

## Parameters

### config?

`Partial`\<`OriginKnex.Config`\> = `{}`

### connection?

`string`

## Returns

`Promise`\<`Knex`\<`any`, `any`[]\>\>
