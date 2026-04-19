# PG Table Types Guide

When implementing or reviewing `@faasjs/pg` table typing, default to declaration merging on `Tables`.

## Use This Guide When

- defining application tables for `@faasjs/pg`
- adding columns or JSONB shapes
- reviewing how query inference should flow from the table definition
- extracting helpers that depend on `TableType`, `ColumnName`, or `ColumnValue`

## Default Workflow

1. Extend `Tables` in app code with `declare module '@faasjs/pg'`.
2. Model each table as its runtime row shape.
3. Let `client.query`, `TableType`, `ColumnName`, and `ColumnValue` infer from that source.
4. Add or update `expectTypeOf(...)` coverage when a shared helper or package change affects inference.

## Minimal Example

```ts
declare module '@faasjs/pg' {
  interface Tables {
    users: {
      id: number
      name: string
      metadata: {
        age: number
        timezone?: string
      }
    }
  }
}
```

## Rules

### 1. Treat `Tables` as the source of truth

- `Tables` drives table-name inference and column-level type inference.
- When a table shape changes, update the merged interface before adjusting query code.
- Keep the type definition close to the application boundary that owns the table.

### 2. Keep row shapes concrete

- Model row fields with their actual runtime names and value shapes.
- Prefer exact object types for JSON or JSONB columns instead of `any`.
- Include optional properties only when the stored JSON shape is genuinely optional.

### 3. Preserve the consumer extension pattern

- App code should keep using module augmentation on `Tables`.
- Do not replace declaration merging with an app-specific registry or runtime-only typing.
- When contributing to `@faasjs/pg`, keep fallback behavior for untyped tables deliberate and documented.

### 4. Keep helper types aligned

- `TableType<T>` should represent the row shape for a known table.
- `ColumnName<T>` should stay aligned with actual keys of the table type.
- `ColumnValue<T, C>` should resolve to the value type for that column.

### 5. Update type coverage when the surface changes

- Add or update `expectTypeOf(...)` assertions when changing declaration merging, shared helpers, or query inference.
- If a new query-builder feature affects result shape, test both runtime output and inferred types.
- Prefer targeted type assertions over broad snapshots of unrelated inferred types.

## Review Checklist

- `Tables` contains the new or changed table shape
- JSON and JSONB columns use concrete object types
- declaration merging still works from consumer code
- helper types stay aligned with the merged table definition
- public or shared type changes include `expectTypeOf(...)` coverage

## Read Next

- [PG Query Builder Guide](./pg-query-builder.md)
- [PG Testing Guide](./pg-testing.md)
- [Tables](../references/packages/pg/interfaces/Tables.md)
- [TableType](../references/packages/pg/type-aliases/TableType.md)
- [ColumnName](../references/packages/pg/type-aliases/ColumnName.md)
- [ColumnValue](../references/packages/pg/type-aliases/ColumnValue.md)
