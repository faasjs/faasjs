# Knex Rules

Use these rules when writing or reviewing FaasJS code with `@faasjs/knex`.

## Core Rules

1. Prefer query-builder APIs (`query`, `useKnex().query`, `select`, `insert`, `update`, `delete`) over `raw`.
2. Use `transaction` for multi-step writes that must succeed or fail together.
3. Inside a transaction callback, keep all SQL on the provided `trx`; do not mix with global `query(...)`.
4. Never interpolate external input into SQL strings. If `raw` is required, always use bindings.
5. Keep queries explicit:
   - use `.select(...)` instead of implicit `*`
   - use `.first()` when expecting one row
   - add `.where(...)` before `update` or `delete`
   - add deterministic `.orderBy(...)` when paginating

## Raw SQL (Escape Hatch)

`raw` is allowed only when query-builder cannot express the SQL clearly, for example:
- vendor-specific SQL features/functions
- performance-sensitive statements that must stay handwritten
- DDL or maintenance scripts

When using `raw`:
1. Add a one-line comment explaining why query-builder is not enough.
2. Use parameter bindings (`?` or named bindings), never template strings.
3. Keep raw snippets small and local; avoid large dynamic SQL assembly.

## Transactions

- Prefer `transaction(async trx => { ... })` from `@faasjs/knex`.
- Use `trx` for all reads/writes in that unit of work.
- Let the helper manage commit/rollback automatically.
- If an outer transaction exists, pass it via `options.trx` instead of creating unmanaged nested transactions.

## FaasJS Usage

- Configure Knex in `src/faas.yaml` and let `defineFunc` auto-load plugins.
- Use `query(...)`, `transaction(...)`, or `useKnex().query(...)` in handlers.
- Call `useKnex()` directly only when you need a named connection instance.
- Do not create ad-hoc `new Knex()` in application business code (tests/infrastructure code are exceptions).
- Do not call `quit()` in request handlers.

## Examples

### Prefer

```yaml
# src/faas.yaml
defaults:
  plugins:
    knex:
      config:
        client: better-sqlite3
        connection:
          filename: ./data/app.db
```

```ts
import { defineFunc } from '@faasjs/func'
import { query, transaction } from '@faasjs/knex'

export const func = defineFunc<{ params: { userId: number } }>(
  async ({ event }) => {
    const user = await query('users')
      .select('id', 'email')
      .where({ id: event.params.userId })
      .first()

    if (!user) throw Error('User not found')

    await transaction(async trx => {
      await trx('audit_logs').insert({
        user_id: user.id,
        action: 'login',
      })

      await trx('users')
        .where({ id: user.id })
        .update({ last_login_at: new Date() })
    })
  }
)
```

### Avoid

```ts
await raw(`UPDATE users SET email='${params.email}' WHERE id='${params.userId}'`)
```
