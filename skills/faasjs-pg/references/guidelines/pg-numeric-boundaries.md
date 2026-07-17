# PG Numeric Boundaries Guide

Use this guide when PostgreSQL `numeric`, `decimal`, or `bigint` values cross TypeScript, JSON, API, calculation, or migration boundaries.

## Preserve Exact Values

Exact PostgreSQL values may exceed JavaScript's safe integer range or require decimal precision that `number` cannot preserve. The default `postgres.js` path represents precision-sensitive database values as strings rather than silently losing precision.

- Declare exact database columns with the runtime type the client actually returns, normally `string` for `numeric`, `decimal`, and large `bigint` values.
- Do not call `Number(value)` for money, balances, quantities, identifiers, or aggregates unless the domain has a proven safe range and precision policy.
- Keep exact values as validated decimal strings, integer minor units, or values managed by one reviewed decimal abstraction.
- Quantize and validate scale at the business boundary before calculations or writes.
- Define API serialization explicitly; do not let an incidental database parser decide the public contract.

If the client is configured with a custom PostgreSQL type parser, update `Tables` declarations, API schemas, and runtime/type tests together.

## Query And Calculation Rules

- Parameterize numeric inputs; do not concatenate decimal text into SQL.
- Use SQL arithmetic when PostgreSQL should own precision and rounding.
- When using `sql` update expressions, verify the result against the real column type because the expression is a TypeScript escape hatch.
- Review aggregates such as `SUM` and `AVG` independently; their PostgreSQL result types may differ from the input column type.
- Convert to display strings at the UI boundary and keep localized formatting out of stored values.

## Migration Rules

For precision or scale changes:

- inspect existing values before narrowing precision or scale
- define the intended rounding or rejection behavior explicitly
- keep the `Tables` declaration aligned with the post-migration runtime representation
- test both migration and rollback with boundary values

## Validation

- execute the query against PostgreSQL/PGlite and assert the runtime `typeof` value
- pair the runtime assertion with `expectTypeOf(...)`
- include a value above `Number.MAX_SAFE_INTEGER` for `bigint`
- include fractional values that cannot be represented exactly as binary floating point
- round-trip insert, read, calculation, and API serialization without precision loss
- verify any custom parser with the same production client options
