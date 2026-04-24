# PG Table Types Guide

When implementing or reviewing `@faasjs/pg` table typing, default to declaration merging on `Tables`.

## Default Workflow

1. Put the augmentation in an app-owned type file such as `src/types/faasjs-pg.d.ts`, and make sure `tsconfig.json` includes that file before expecting inference to change.
2. In a `.d.ts` file, import `@faasjs/pg` first, then extend `Tables` with `declare module '@faasjs/pg'`.
3. Model each table as its runtime row shape, and keep JSON and JSONB object shapes in that merged interface.
4. Let `client.query`, `TableType`, `ColumnName`, and `ColumnValue` infer from that source instead of forcing result types with `as`.
5. Use a narrow assertion only when converting data returned by `client.raw(...)` or another raw boundary into an app-specific shape.
6. Add or update `expectTypeOf(...)` coverage when a shared helper or package change affects inference.

## Minimal Example

```ts
// src/types/faasjs-pg.d.ts
import '@faasjs/pg'

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
- Keep the augmentation in a `.d.ts` or `.ts` file that TypeScript already includes for the app.
- When the augmentation lives in a `.d.ts`, import `@faasjs/pg` first so TypeScript augments the real module instead of declaring a separate ambient one.
- Define JSON and JSONB column shapes in `declare module '@faasjs/pg'` instead of scattering duplicate aliases elsewhere.
- If inference does not update, check `tsconfig.json` `include`, `files`, and project references before adding casts.

### 2. Keep row shapes concrete

- Model row fields with their actual runtime names and value shapes.
- Prefer exact object types for JSON or JSONB columns instead of `any`.
- Include optional properties only when the stored JSON shape is genuinely optional.

### 3. Prefer inference over assertions

- Let typed query results flow from `Tables`, `select(...)`, `first()`, and shared helper generics.
- Do not use `as` to force query result types unless the data comes from `client.raw(...)` or another raw boundary.
- If typed query code seems to need a cast, fix the table definition, selected columns, or helper signature instead.

### 4. Preserve the consumer extension pattern

- App code should keep using module augmentation on `Tables`.
- Do not replace declaration merging with an app-specific registry or runtime-only typing.
- When contributing to `@faasjs/pg`, keep fallback behavior for untyped tables deliberate and documented.

### 5. Keep helper types aligned

- `TableType<T>` should represent the row shape for a known table.
- `ColumnName<T>` should stay aligned with actual keys of the table type.
- `ColumnValue<T, C>` should resolve to the value type for that column.

### 6. Update type coverage when the surface changes

- Add or update `expectTypeOf(...)` assertions when changing declaration merging, shared helpers, or query inference.
- If a new query-builder feature affects result shape, test both runtime output and inferred types.
- Prefer targeted type assertions over broad snapshots of unrelated inferred types.

## Review Checklist

- `Tables` contains the new or changed table shape
- the augmentation file lives in a source or type root included by `tsconfig.json`
- JSON and JSONB columns use concrete object types defined in `declare module '@faasjs/pg'`
- typed query results do not rely on `as` outside raw boundaries
- declaration merging still works from consumer code
- helper types stay aligned with the merged table definition
- public or shared type changes include `expectTypeOf(...)` coverage
