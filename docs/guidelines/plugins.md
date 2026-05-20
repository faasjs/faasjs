# Plugins Guide

Use this guide when adding cross-cutting behavior that should run before or after every request — such as auth, tenant resolution, request logging, rate limiting, or feature flags. Plugins hook into the FaasJS request lifecycle and can inject typed fields into `defineApi` and `defineJob` handlers.

## Applicable Scenarios

- Injecting `current_user`, tenant context, or request metadata into every handler
- Adding request-scoped logging, tracing, or timing
- Validating auth tokens, API keys, or permissions before the business handler runs
- Controlling response shape (headers, body, status code) from a shared layer
- Wrapping every request with setup and teardown logic (e.g. opening a transaction, clearing a cache)

## How Plugins Work

FaasJS plugins follow a Koa-style middleware model. Each plugin has a `type` (source identifier) and a `name` (runtime instance id). Plugins execute in registration order:

1. `onMount` runs once per `Func` instance, before the first request. Use it to initialize connections, merge configuration, or validate prerequisites.
2. `onInvoke` runs on every request. Plugins receive a mutable `InvokeData` object shared across the chain. Use `await next()` to continue to the next plugin or the business handler.

The built-in `RunHandler` plugin always runs last and calls the business handler. User plugins always execute before it.

## Default Workflow

1. Decide whether the plugin is one-off (inline in a specific API) or reusable (shared across endpoints).
2. For a reusable plugin, create a `plugins/` directory in your project (e.g. `src/plugins/auth.ts`).
3. Implement the `Plugin` interface with `type`, `name`, and at least one lifecycle method (`onMount` or `onInvoke`).
4. Inject fields by mutating `data` before calling `await next()`.
5. Add TypeScript declaration merging for `DefineApiInject` so handlers see typed injected fields.
6. Register the plugin via `faas.yaml` (config-driven) or directly in code on `Func` or `defineApi`.

## Rules

### 1. Implement the Plugin interface correctly

Every plugin must expose `type` and `name` as readonly strings, and implement at least one lifecycle method.

```ts
import type { InvokeData, MountData, Next, Plugin } from '@faasjs/core'

class AuthPlugin implements Plugin {
  public readonly type = 'auth'
  public readonly name = 'auth'

  public async onMount(data: MountData, next: Next) {
    // Run once: load keys, verify config
    await next()
  }

  public async onInvoke(data: InvokeData, next: Next) {
    // Run on every request: resolve current user
    data.current_user = { id: 1, name: 'FaasJS' }
    await next()
  }
}
```

- `type` identifies the plugin source or module, not the runtime instance.
- `name` is the runtime identity and must be stable — it is used for ordering, deduplication, config lookup, and logs.
- `name` and `type` may be the same value when the plugin has no config-driven variant.

### 2. Inject fields by mutating `InvokeData`

Plugins share a mutable `InvokeData` object. Add fields to it before calling `next()` so that downstream plugins and the business handler receive them.

```ts
public async onInvoke(data: InvokeData, next: Next) {
  data.current_user = await resolveUser(data.event.headers?.authorization)
  data.requestId = crypto.randomUUID()
  await next()
}
```

- Prefer adding fields directly to `data` over using `context` — `context` is for internal framework wiring.
- Do not wrap `data` in another object; add fields at the top level so handlers see them directly.

### 3. Provide types via `DefineApiInject` module augmentation

Handlers receive typed injected fields when the plugin author declares them via TypeScript module augmentation.

```ts
import type { InvokeData, Next, Plugin } from '@faasjs/core'

declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: {
      id: number
      name: string
      roles: string[]
    } | null
  }
}
```

This lets `defineApi` handlers reference `current_user` with full type safety:

```ts
export default defineApi({
  async handler({ current_user }) {
    // current_user is typed as { id: number; name: string; roles: string[] } | undefined | null
    if (!current_user) throw new HttpError({ statusCode: 401, message: 'Not authenticated' })
    return { user: current_user }
  },
})
```

### 4. Use `onMount` for one-time initialization

`onMount` runs once per `Func` instance, before the first `onInvoke`. Use it for:

- Loading keys, certificates, or remote configuration
- Validating that plugin prerequisites are met
- Merging `faas.yaml` config into the plugin instance
- Opening persistent connections

```ts
class DatabasePlugin implements Plugin {
  public readonly type = 'db'
  public readonly name = 'db'
  public config?: DbConfig
  private pool?: Pool

  public async onMount(data: MountData, next: Next) {
    // Merge YAML config into this.config
    if (data.config.plugins?.[this.name]?.config) {
      this.config = { ...data.config.plugins[this.name].config }
    }
    this.pool = await createPool(this.config?.connectionString)
    await next()
  }
}
```

- `onMount` runs in plugin order and runs at most once.
- Configuration from `faas.yaml` is available on `data.config.plugins[name]` during `onMount`.

### 5. Register plugins via `faas.yaml` for config-driven loading

The recommended way to configure reusable plugins is through `faas.yaml`. This keeps plugin wiring declarative and supports directory-level overrides.

```yaml
# src/faas.yaml
defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          secure: false
    auth:
      type: file://./plugins/auth.ts
      config:
        provider: jwt
        secret: ${AUTH_SECRET}
```

Plugin entries in `faas.yaml` are keyed by plugin `name`. Each entry requires:

- `type`: resolves the plugin module. Use `file://` for local plugin files, bare names (e.g. `auth`) for `@faasjs/<type>` packages, or scoped names for npm packages.
- `config`: optional configuration passed to the plugin instance.

For built-in plugins, `type` can be omitted:

- `http` resolves to `@faasjs/core` automatically.

### 6. Register plugins in code for one-off or programmatic use

For plugins specific to a single API or needing programmatic construction, pass them directly to `Func` or `defineApi`.

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class TracePlugin implements Plugin {
  public readonly type = '@/plugins/trace'
  public readonly name = 'trace'

  public async onInvoke(data: InvokeData, next: Next) {
    const start = Date.now()
    await next()
    data.logger.debug('request took %dms', Date.now() - start)
  }
}

export default new Func({
  plugins: [new TracePlugin()],
  async handler({ context }) {
    return { ok: true }
  },
})
```

For `defineApi`, add plugins to `api.plugins` before the `RunHandler`:

```ts
const api = defineApi({
  async handler({ context }) {
    return { loaded: context.sharedLoaded }
  },
})

api.plugins.unshift(new SharedPlugin())
```

- Manual plugin arrays do not perform implicit deduplication.
- When a plugin exists in code and also in `faas.yaml` config for the same `name`, the existing code instance is reused and receives the merged config via `applyConfig` or deep merge.

### 7. Understand config merging and precedence

Plugin configuration can come from three sources, merged in this order:

1. **Project root `faas.yaml`** — baseline config
2. **Deeper directory `faas.yaml`** — scope-level overrides (deep merge, deeper wins)
3. **Code-authored config** — inline config on `api.config.plugins[name]` (highest priority)

```
faas.yaml root  →  faas.yaml deeper  →  code config (wins)
```

Real-world example:

```yaml
# src/faas.yaml
defaults:
  plugins:
    auth:
      type: file://./plugins/auth.ts
      config:
        provider: jwt
        secret: base-secret
```

```yaml
# src/admin/faas.yaml
defaults:
  plugins:
    auth:
      config:
        secret: admin-secret
```

```ts
api.config = {
  plugins: {
    auth: { config: { secret: 'code-secret' } },
  },
}
```

Resolved config: `provider` remains `'jwt'` (from root), `secret` becomes `'code-secret'` (code wins over both YAML layers).

### 8. Implement `applyConfig` for custom config merging

When a plugin needs custom merge logic beyond deep merge, implement `applyConfig`. This method receives the final resolved config for the plugin's `name` after YAML layering and before `onMount`.

```ts
class AuthPlugin implements Plugin {
  public readonly type = 'auth'
  public readonly name = 'auth'
  public config: Record<string, any> = {}

  public applyConfig(config: { type: string; name: string; config?: Record<string, any> }) {
    // Custom merge logic
    this.config = {
      provider: config.config?.provider || 'jwt',
      secret: config.config?.secret || process.env.AUTH_SECRET,
    }
  }
}
```

- `applyConfig` is called only when the plugin is registered in code and config exists for its `name` in `faas.yaml`.
- If you do not implement `applyConfig`, the loader deep-merges `config.config` into `plugin.config` automatically.

### 9. Always call `next()` exactly once per lifecycle hook

The lifecycle chain depends on `await next()`. Calling it multiple times in the same hook will reject with `next() called multiple times`.

```ts
// Correct: call next() exactly once
public async onInvoke(data: InvokeData, next: Next) {
  data.logger.debug('before')
  await next()
  data.logger.debug('after')
}

// Incorrect: this will throw
public async onInvoke(data: InvokeData, next: Next) {
  await next()
  await next() // Rejects: "next() called multiple times"
}
```

- Wrap `next()` with setup/teardown logic — code before `next()` runs on the way in, code after `next()` runs on the way out.
- Plugins after your plugin in the chain (including the business handler) execute between your `next()` call.

### 10. Test plugins with real `Func` instances

Test plugins through a real `Func` or `defineApi` to exercise the full lifecycle.

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

class TestPlugin implements Plugin {
  public readonly type = 'test'
  public readonly name = 'test'

  public async onInvoke(data: InvokeData, next: Next) {
    data.injected = 'value'
    await next()
  }
}

describe('TestPlugin', () => {
  it('injects fields into handler data', async () => {
    const func = new Func({
      plugins: [new TestPlugin()],
      handler: ({ injected }) => ({ injected }),
    })
    const result = await func.invoke({})
    expect(result.injected).toBe('value')
  })

  it('wraps handler execution', async () => {
    const callOrder: string[] = []
    class WrapPlugin implements Plugin {
      public readonly type = 'wrap'
      public readonly name = 'wrap'
      public async onInvoke(_data: InvokeData, next: Next) {
        callOrder.push('before')
        await next()
        callOrder.push('after')
      }
    }
    const func = new Func({
      plugins: [new WrapPlugin()],
      handler: () => {
        callOrder.push('handler')
        return {}
      },
    })
    await func.invoke({})
    expect(callOrder).toEqual(['before', 'handler', 'after'])
  })
})
```

For `defineApi` plugins, use `testApi` from `@faasjs/dev`:

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import api from '../create.api'

describe('create with auth plugin', () => {
  const handler = testApi(api)

  it('returns 401 when no user', async () => {
    const response = await handler({ title: 'test' })
    expect(response.statusCode).toBe(401)
  })
})
```

## Plugin vs Alternative Mechanisms

| Need                                    | Use              | Reason                                                                 |
| --------------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| Auth, tenant, request metadata, logging | Plugin           | Runs on every request, state is injected into handler data             |
| Input validation                        | `schema` in API  | Zod schema in `defineApi` validates params at the boundary             |
| Business logic                          | `handler` in API | The handler receives typed params and injected fields                  |
| Database access inside a handler        | `getClient()`    | Inside handler, call `getClient()` from `@faasjs/pg`                   |
| One-off data processing per request     | Handler inline   | Keep one-off logic in the handler unless it affects multiple endpoints |
| Background work                         | `defineJob`      | Use jobs for async work that should not block the request              |
| HTTP-level behavior                     | Built-in `http`  | The built-in `http` plugin handles cookies, sessions, and responses    |

## Review Checklist

- Plugin implements `type` and `name` as readonly strings
- Plugin implements `onMount`, `onInvoke`, or both
- Plugin augments `DefineApiInject` for typed handler fields
- Plugin is configured in `faas.yaml` (reusable) or in code (one-off)
- Plugin calls `next()` exactly once per lifecycle hook
- Tests exercise the full lifecycle through `Func.invoke()` or `testApi()`
- Config merging order respects YAML layering then code precedence
- Plugin names are stable and not duplicated within the same `Func` instance

## Further Reading

- [Plugin Specification](/docs/specs/plugin.html) — Full normative spec for plugin identity, lifecycle, config layering, and loading
- [defineApi Guide](./define-api.md) — API endpoint definition with schema validation
- [Testing Guide](./testing.md) — Testing principles and `testApi` usage
- [Jobs Guide](./jobs.md) — Background jobs and `defineJob`
- [faas.yaml Specification](/docs/specs/faas-yaml.html) — Full YAML configuration reference
