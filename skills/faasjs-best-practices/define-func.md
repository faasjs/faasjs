# defineFunc Guide

`defineFunc` is the default way to implement FaasJS `*.func.ts` handlers in this skill.

## What it does

- Accepts business logic directly (`async ({ event, context }) => { ... }`).
- Auto-loads plugins from `func.config.plugins` on first mount.
- Keeps endpoint files focused on validation and domain logic.

## Plugin config (`src/faas.yaml`)

`defineFunc` reads plugin settings from `faas.yaml` (loaded into `func.config` by
`@faasjs/load`, `@faasjs/server`, or `@faasjs/dev`).

```yaml
defaults:
  plugins:
    http:
      config:
        cookie:
          secure: false
          session:
            secret: secret
```

Notes:

- `plugins.<key>` is the plugin name.
- If `type` is omitted, the key is used as plugin type (`http` -> `@faasjs/http`).
- Set `type` explicitly when plugin name and module type should differ.

## Example Endpoint

`src/pages/home/api/hello.func.ts`:

```ts
import { defineFunc } from '@faasjs/func'
import { z } from 'zod'

const schema = z
  .object({
    name: z.string().optional(),
  })
  .required()

export const func = defineFunc<{ params?: z.infer<typeof schema> }>(
  async ({ event }) => {
    const parsed = schema.parse(event.params || {})

    return {
      ok: true,
      data: `Hello, ${parsed.name || 'FaasJS'}`,
      error: null,
    }
  }
)
```

## Common Errors

- `Failed to load plugin "..."`: check `plugins.<name>.type` and package installation.
- `Failed to resolve plugin class "..."`: use a valid plugin module that exports a plugin class.
- `Client not initialized`: ensure required plugins (for example `http`/`knex`) are configured in `src/faas.yaml`.
