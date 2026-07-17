**@faasjs/pg**

# @faasjs/pg

# @faasjs/pg

A TypeScript-first PostgreSQL query builder and migration toolkit built on top of `postgres.js`.

The package exposes:

- cached [Client](classes/Client.md) instances created with [createClient](functions/createClient.md) and resolved with [getClient](functions/getClient.md);
- a fluent [QueryBuilder](classes/QueryBuilder.md) for parameterized SELECT, INSERT, UPDATE, DELETE, and upsert calls;
- parameterized [sql](variables/sql.md) expressions for atomic updates;
- schema and migration helpers for test and application database setup;
- declaration-merging types such as [Tables](interfaces/Tables.md), [TableName](type-aliases/TableName.md), and [ColumnName](type-aliases/ColumnName.md).

Prefer query-builder methods or `Client.raw` parameters for runtime values. Helpers such as
[rawSql](functions/rawSql.md), `whereRaw`, `orderByRaw`, and schema `raw()` methods accept trusted SQL text and
should only be used for fragments controlled by the application.

## Install

```sh
npm install @faasjs/pg
```

## Functions

- [createClient](functions/createClient.md)
- [createTemplateStringsArray](functions/createTemplateStringsArray.md)
- [escapeIdentifier](functions/escapeIdentifier.md)
- [escapeValue](functions/escapeValue.md)
- [getClient](functions/getClient.md)
- [getClients](functions/getClients.md)
- [isNormalOperator](functions/isNormalOperator.md)
- [isOperator](functions/isOperator.md)
- [isTemplateStringsArray](functions/isTemplateStringsArray.md)
- [rawSql](functions/rawSql.md)
- [registerDatabaseBootstrap](functions/registerDatabaseBootstrap.md)
- [resolveDatabaseBootstrap](functions/resolveDatabaseBootstrap.md)

## Classes

- [Client](classes/Client.md)
- [Migrator](classes/Migrator.md)
- [QueryBuilder](classes/QueryBuilder.md)
- [SchemaBuilder](classes/SchemaBuilder.md)
- [TableBuilder](classes/TableBuilder.md)

## Interfaces

- [Tables](interfaces/Tables.md)

## Type Aliases

- [AliasedSelectField](type-aliases/AliasedSelectField.md)
- [ArrayOperators](type-aliases/ArrayOperators.md)
- [ClientOptions](type-aliases/ClientOptions.md)
- [ColumnName](type-aliases/ColumnName.md)
- [ColumnValue](type-aliases/ColumnValue.md)
- [DatabaseBootstrap](type-aliases/DatabaseBootstrap.md)
- [ForUpdateOptions](type-aliases/ForUpdateOptions.md)
- [InferTResult](type-aliases/InferTResult.md)
- [JoinCondition](type-aliases/JoinCondition.md)
- [JsonOperators](type-aliases/JsonOperators.md)
- [JsonSelectField](type-aliases/JsonSelectField.md)
- [NormalOperators](type-aliases/NormalOperators.md)
- [NullOperators](type-aliases/NullOperators.md)
- [Operator](type-aliases/Operator.md)
- [Operators](type-aliases/Operators.md)
- [OrderByCondition](type-aliases/OrderByCondition.md)
- [PatternOperators](type-aliases/PatternOperators.md)
- [QueryOrderDirection](type-aliases/QueryOrderDirection.md)
- [QueryOrderDirections](type-aliases/QueryOrderDirections.md)
- [RawSql](type-aliases/RawSql.md)
- [SelectField](type-aliases/SelectField.md)
- [SqlExpression](type-aliases/SqlExpression.md)
- [SqlReference](type-aliases/SqlReference.md)
- [TableName](type-aliases/TableName.md)
- [TableType](type-aliases/TableType.md)
- [TransactionIsolationLevel](type-aliases/TransactionIsolationLevel.md)
- [TransactionOptions](type-aliases/TransactionOptions.md)
- [WhereCondition](type-aliases/WhereCondition.md)

## Variables

- [sql](variables/sql.md)
