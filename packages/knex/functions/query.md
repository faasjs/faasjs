[@faasjs/knex](../README.md) / query

# Function: query()

## Call Signature

> **query**\<`TName`\>(`table`): `OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, `object`[]\>

### Type Parameters

• **TName** *extends* `"test"`

### Parameters

#### table

`TName`

### Returns

`OriginKnex.QueryBuilder`\<`OriginKnex.TableType`\<`TName`\>, `object`[]\>

## Call Signature

> **query**\<`TName`, `TResult`\>(`table`): `OriginKnex.QueryBuilder`\<`TName`, `TResult`\>

### Type Parameters

• **TName** *extends* `object` = `any`

• **TResult** = `any`[]

### Parameters

#### table

`string`

### Returns

`OriginKnex.QueryBuilder`\<`TName`, `TResult`\>
