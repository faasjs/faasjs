[@faasjs/knex](../README.md) / query

# Function: query()

## query(table)

> **query**\<`TName`\>(`table`): `OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, `object`[]\>

### Type parameters

• **TName** *extends* `"test"`

### Parameters

• **table**: `TName`

### Returns

`OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, `object`[]\>

## query(table)

> **query**\<`TName`, `TResult`\>(`table`): `OriginKnex.QueryBuilder`\<`TName`, `TResult`\>

### Type parameters

• **TName** *extends* `object` = `any`

• **TResult** = `any`[]

### Parameters

• **table**: `string`

### Returns

`OriginKnex.QueryBuilder`\<`TName`, `TResult`\>
