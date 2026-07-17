/**
 * # @faasjs/pg
 *
 * A TypeScript-first PostgreSQL query builder and migration toolkit built on top of `postgres.js`.
 *
 * The package exposes:
 *
 * - cached {@link Client} instances created with {@link createClient} and resolved with {@link getClient};
 * - a fluent {@link QueryBuilder} for parameterized SELECT, INSERT, UPDATE, DELETE, and upsert calls;
 * - parameterized {@link sql} expressions for atomic updates;
 * - schema and migration helpers for test and application database setup;
 * - declaration-merging types such as {@link Tables}, {@link TableName}, and {@link ColumnName}.
 *
 * Prefer query-builder methods or `Client.raw` parameters for runtime values. Helpers such as
 * {@link rawSql}, `whereRaw`, `orderByRaw`, and schema `raw()` methods accept trusted SQL text and
 * should only be used for fragments controlled by the application.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/pg
 * ```
 *
 * @packageDocumentation
 */
export * from './migrator'
export * from './bootstrap'
export * from './client'
export * from './query-builder'
export * from './types'
export * from './schema-builder'
export * from './utils'
export { sql, type SqlExpression, type SqlReference } from './sql'
