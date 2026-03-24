# defineApi Guide

`defineApi` is the default way to implement FaasJS `*.func.ts` handlers in this skill.

## What it does

- Accepts an object with `handler` and optional `schema`.
- Validates request JSON body into typed `params`.
- Auto-loads plugins from `func.config.plugins` on first mount.
- Requires the `http` plugin to be configured.
- Keeps endpoint files focused on validation and domain logic.

## Plugin config (`src/faas.yaml`)

`defineApi` reads plugin settings from `faas.yaml` (loaded into `func.config` by
`@faasjs/core` or `@faasjs/dev`).

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
- If `type` is omitted, the key is used as plugin type (`http` -> `@faasjs/core`).
- Set `type` explicitly when plugin name and module type should differ.
- `http` is the built-in plugin type exported by `@faasjs/core`.

## Example Endpoint

`src/pages/home/api/hello.func.ts`:

```ts
import { defineApi, z } from '@faasjs/core'

export const func = defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    return {
      message: `Hello, ${params.name || 'FaasJS'}!`,
    }
  },
})
```

## Common Errors

- `[defineApi] Missing required "http" plugin...`: ensure `plugins.http` is configured in `src/faas.yaml`.
- `[defineApi] Failed to load plugin "..."`: check `plugins.<name>.type` and package installation.
- `[defineApi] Failed to resolve plugin class "..."`: use a valid plugin module that exports a named or default plugin class.
- `Invalid params`: the request JSON body does not match the Zod `schema`.
