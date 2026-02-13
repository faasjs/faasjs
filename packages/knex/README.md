# @faasjs/knex

FaasJS's sql plugin, base on [Knex](https://knexjs.org/).

[![License: MIT](https://img.shields.io/npm/l/@faasjs/knex.svg)](https://github.com/faasjs/faasjs/blob/main/packages/knex/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/knex.svg)](https://www.npmjs.com/package/@faasjs/knex)

## Install

```sh
npm install @faasjs/knex
```

## PGlite Notes

- Use `client: pglite` with string `connection`.
- If `connection` is missing, it defaults to an in-memory database.
- Install `@electric-sql/pglite` and `knex-pglite` in your project.
- `pool` is ignored for PGlite, and parent directories are created automatically for path connections.

## Functions

- [createPgliteKnex](functions/createPgliteKnex.md)
- [initPostgresTypeParsers](functions/initPostgresTypeParsers.md)
- [mountFaasKnex](functions/mountFaasKnex.md)
- [query](functions/query.md)
- [raw](functions/raw.md)
- [transaction](functions/transaction.md)
- [unmountFaasKnex](functions/unmountFaasKnex.md)
- [useKnex](functions/useKnex.md)

## Classes

- [Knex](classes/Knex.md)

## Type Aliases

- [KnexConfig](type-aliases/KnexConfig.md)
- [MountFaasKnexOptions](type-aliases/MountFaasKnexOptions.md)

## Variables

- [originKnex](variables/originKnex.md)
