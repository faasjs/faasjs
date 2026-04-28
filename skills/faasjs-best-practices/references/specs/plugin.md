# Plugin Specification

## Background

FaasJS supports plugins in two complementary layers:

- code registers plugin instances on `Func`
- `faas.yaml` provides staged, directory-aware plugin configuration

The runtime behavior is already stable across `@faasjs/core` and `@faasjs/node-utils`, but the contract is currently spread across source code, tests, and published docs.

This specification defines the baseline for plugin identity, lifecycle execution, config layering, and config-driven loading.

Related references:

- `packages/core/src/func/index.ts`
- `packages/core/src/index.ts`
- `packages/node-utils/src/load_config.ts`
- `packages/core/src/plugins/http/index.ts`
- `docs/zh/guide/excel/plugin.md`

## Goals

- Keep plugin authoring and loading behavior predictable.
- Define how plugin identity, ordering, config precedence, and deduplication work.
- Make code registration and `faas.yaml` config play together without ambiguous ownership.
- Align config-driven loading with current `defineApi()` behavior.

## Non-goals

- Defining each plugin package's private `config` schema.
- Standardizing npm publishing, versioning, or marketplace metadata for plugins.

## Normative Rules

### 1. Runtime Plugin Contract

1. A plugin instance MUST expose string `type` and string `name` fields.
2. Plugin `name` MUST identify the runtime plugin id.
3. Plugin `type` MUST identify the plugin source, family, or module specifier rather than the runtime instance id.
4. Plugin `name` SHOULD stay stable within the same function because ordering, deduplication, logs, and config lookup rely on it.
5. A plugin MAY implement `onMount`, `onInvoke`, or both.
6. Plugins auto-loaded by `defineApi()` MUST be created from a constructor whose prototype implements at least one lifecycle method: `onMount` or `onInvoke`.
7. Plugins registered in code MAY implement `applyConfig(resolvedConfig)` to receive the final merged config for their plugin id before first mount.

### 2. Lifecycle Execution Model

1. User plugins MUST execute before the built-in run-handler plugin.
2. `onMount` hooks MUST run in plugin order and MUST run at most once per `Func` instance.
3. `onInvoke` hooks MUST run in plugin order for every invocation.
4. Plugins MUST use `await next()` to continue the lifecycle chain.
5. Calling `next()` multiple times from the same lifecycle hook MUST reject with `next() called multiple times`.
6. Plugins MAY mutate mount or invoke data to inject fields, prepare context, or control the final response.
7. Errors thrown by a plugin or downstream handler MUST stop the current chain and propagate to the caller.

### 3. Configuration Layering And Precedence

1. Plugin configuration MAY be authored in code, in `faas.yaml`, or both.
2. `faas.yaml` plugin config MUST support directory-level layering from project root toward the target API directory.
3. When multiple `faas.yaml` files contribute config for the same plugin id, the deeper directory MUST override the shallower directory while preserving unspecified fields through deep merge.
4. Code-authored plugin config MUST override merged `faas.yaml` config for the same plugin id.
5. Plugin config merging MUST use plugin `name` as the identity key.
6. Resolved plugin config exposed on `func.config.plugins` MUST reflect the final merged view after directory layering and code overrides.

### 4. Manual Registration

1. `new Func({ plugins: [...] })` MUST preserve the provided plugin order.
2. Manual plugin arrays MUST NOT perform implicit deduplication; callers are responsible for avoiding duplicate plugin names when that matters.
3. When code registers a plugin instance, that instance remains the source of runtime behavior; config resolution MAY augment its settings but MUST NOT silently replace it with another instance from YAML.
4. When a pre-registered plugin instance implements `applyConfig`, the loader SHOULD call it with the final merged config for that plugin id.

### 5. Config-Driven Loading In `defineApi()`

1. `defineApi()` MUST resolve staged `faas.yaml` config and `func.config.plugins` before the first mount or invoke.
2. The loader MUST inspect only own enumerable keys on `config.plugins`.
3. Plugin config entries in `func.config.plugins` MUST be keyed by plugin id.
4. For config-driven loading, resolved plugin `name` MUST default to the entry key and therefore represent the plugin id.
5. For an object config entry, resolved plugin `type` MUST come from `type`, then fall back to the entry key only for built-in plugin ids explicitly supported by the runtime.
6. The loader MUST instantiate plugins with the resolved config object plus resolved `name` and `type`.
7. If a plugin with the same resolved `name` already exists on the function, config-driven loading MUST NOT create a duplicate runtime instance.
8. When a plugin instance already exists in code and config exists for the same id, the resolved config MUST still be attached to `func.config.plugins[name]` with code values taking precedence.

### 6. Module And Constructor Resolution

1. Plugin type `http` MUST resolve to module `@faasjs/core`.
2. Unscoped bare plugin types such as `mysql` MUST resolve to `@faasjs/<type>`.
3. Scoped package names, relative paths, absolute paths, and `file://` local file URLs MUST resolve as authored after stripping an optional `npm:` prefix.
4. When resolving a class export from a module, the loader MUST first try normalized PascalCase class names derived from the plugin type or trailing path segments.
5. If the named class export is not available, the loader MUST fall back to the module's default export.
6. If neither export is a valid lifecycle plugin constructor, the loader MUST throw an error.
7. If constructor execution throws or returns a non-object plugin instance, the loader MUST throw an error.

### 7. `defineApi()` Requirements

1. A `defineApi()` function MUST have an `http` plugin available after plugin resolution.
2. If the `http` plugin is missing, invocation MUST fail with an error that indicates the required `http` plugin is missing.
3. Additional plugins MAY inject fields into the handler data by mutating invoke data before the business handler runs.
4. Plugin packages that inject extra handler fields SHOULD provide TypeScript module augmentation for `DefineApiInject`.

## Examples

### Manual lifecycle plugin

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class TracePlugin implements Plugin {
  public readonly name = 'trace'
  public readonly type = '@/plugins/trace'

  public async onInvoke(data: InvokeData, next: Next) {
    data.context.trace = ['before']
    await next()
    data.context.trace.push('after')
  }
}

export default new Func({
  plugins: [new TracePlugin()],
  async handler({ context }) {
    context.trace.push('handler')
    return context.trace
  },
})
```

### Config layering with code precedence

```yaml
# src/faas.yaml
defaults:
  plugins:
    auth:
      type: file://./plugins/auth-plugin.ts
      config:
        provider: jwt
        secret: from-root
```

```yaml
# src/admin/faas.yaml
defaults:
  plugins:
    auth:
      config:
        secret: from-admin
```

```ts
import { defineApi } from '@faasjs/core'

const api = defineApi({
  async handler({ config, current_user }) {
    return {
      current_user,
      auth: config.plugins?.auth,
    }
  },
})

api.config = {
  plugins: {
    auth: {
      config: {
        secret: 'from-code',
      },
    },
    http: {
      config: {},
    },
  },
}

export default api
```

In the resolved config:

- plugin id is `auth`, so runtime `name === 'auth'`
- plugin source comes from the configured `type`
- `secret` resolves to `'from-code'`
- `provider` remains `'jwt'`
