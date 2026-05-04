# Plugin Specification

## Background

FaasJS supports plugins at two complementary levels:

- Code registers plugin instances directly with `Func`
- `faas.yaml` provides staged, directory-aware plugin configuration

Runtime behavior is stable in `@faasjs/core` and `@faasjs/node-utils`, but the contract is still scattered across source code, tests, and published docs.

This specification defines the baseline for plugin identification, lifecycle execution, config layering, and config-driven loading.

Related references:

- `packages/core/src/func/index.ts`
- `packages/core/src/index.ts`
- `packages/node-utils/src/load_config.ts`
- `packages/core/src/plugins/http/index.ts`
- `docs/zh/guide/excel/plugin.md`

## Goals

- Keep plugin authoring and loading behavior predictable.
- Define plugin identification, ordering, config priority, and deduplication rules.
- Make code registration and `faas.yaml` configuration work together without ambiguity.
- Keep config-driven loading aligned with current `defineApi()` behavior.

## Non-Goals

- Define each plugin package's private `config` schema.
- Standardize npm publishing, version management, or marketplace metadata.

## Normative Rules

### 1. Runtime Plugin Contract

1. A plugin instance MUST expose string fields `type` and `name`.
2. Plugin `name` MUST identify the runtime plugin id.
3. Plugin `type` MUST identify the plugin source, family, or module specifier, not the runtime instance id.
4. Plugin `name` SHOULD be stable within the same function, because ordering, deduplication, logging, and config lookup depend on it.
5. A plugin MAY implement `onMount`, `onInvoke`, or both.
6. Plugins loaded automatically by `defineApi()` MUST come from a constructor whose prototype implements at least one lifecycle method: `onMount` or `onInvoke`.
7. Code-registered plugins MAY implement `applyConfig(resolvedConfig)` to receive the final merged config for that plugin id before the first mount.

### 2. Lifecycle Execution Model

1. User plugins MUST execute before the built-in run-handler plugin.
2. `onMount` hooks MUST execute in plugin order and MUST execute at most once per `Func` instance.
3. `onInvoke` hooks MUST execute in plugin order on each invocation.
4. Plugins MUST call `await next()` to continue the lifecycle chain.
5. Calling `next()` more than once within the same lifecycle hook MUST reject with `next() called multiple times`.
6. Plugins MAY mutate mount or invoke data to inject fields, prepare context, or control the final response.
7. Errors thrown by a plugin or downstream handler MUST abort the current chain and propagate to the caller.

### 3. Config Layering and Priority

1. Plugin configuration MAY be written in code, in `faas.yaml`, or both.
2. Plugin config in `faas.yaml` MUST support directory-level layering from the project root to the target function directory.
3. When multiple `faas.yaml` files provide config for the same plugin id, deeper directories MUST override shallower ones, while unspecified fields are preserved via deep merge.
4. For the same plugin id, code-level plugin config MUST override the config merged from `faas.yaml`.
5. Plugin config merge MUST use plugin `name` as the identity key.
6. The final plugin config exposed on `func.config.plugins` MUST reflect the final view after directory layering and code overrides.

### 4. Manual Registration

1. `new Func({ plugins: [...] })` MUST preserve the order of the passed plugin array.
2. Manually passed plugin arrays MUST NOT be implicitly deduplicated; callers are responsible for avoiding duplicate plugin names.
3. When code already registered a plugin instance, that instance is still the source of runtime behavior; config resolution MAY supplement its settings, but MUST NOT silently replace it with another instance from YAML.
4. If a registered plugin instance implements `applyConfig`, the loader SHOULD pass the final merged config for that plugin id.

### 5. Config-Driven Loading in `defineApi()`

1. `defineApi()` MUST resolve staged `faas.yaml` config and `func.config.plugins` before the first mount or invoke.
2. The loader MAY only inspect own enumerable keys on `config.plugins`.
3. Plugin config entries in `func.config.plugins` MUST use the plugin id as the key.
4. For config-driven loading, the resolved plugin `name` MUST default to the entry key, therefore it naturally represents the plugin id.
5. For object-shaped config entries, the resolved plugin `type` MUST prefer the `type` field; falling back to the entry key is only allowed for built-in plugin ids explicitly supported by the runtime.
6. The loader MUST instantiate the plugin using "resolved config object + resolved `name` and `type`".
7. If a plugin with the same `name` already exists on the function, config-driven loading MUST NOT create a duplicate runtime instance.
8. When a code-registered plugin instance already exists and the same id also exists in config, the final resolved config MUST still be attached to `func.config.plugins[name]`, with code-level values taking precedence.

### 6. Module and Constructor Resolution

1. Plugin type `http` MUST resolve to module `@faasjs/core`.
2. Bare plugin types without a scope (e.g., `mysql`) MUST resolve to `@faasjs/<type>`.
3. Scoped package names, relative paths, absolute paths, and `file://` local file URLs MUST resolve as-is, after removing the optional `npm:` prefix.
4. When resolving a class export from a module, the loader MUST use the PascalCase class name normalized from the plugin type or the trailing path segment.
5. If no matching named export is a valid lifecycle plugin constructor, the loader MUST throw an error.
6. If the constructor throws during execution, or returns something other than an object-shaped plugin instance, the loader MUST throw an error.

### 7. `defineApi()` Requirements

1. A `defineApi()` function MUST have an `http` plugin after plugin resolution is complete.
2. If the `http` plugin is missing, invocation MUST fail with an error that explicitly indicates the missing `http` plugin.
3. Additional plugins MAY mutate invoke data before the business handler executes, to inject fields into the handler.
4. Plugin packages that inject additional fields into the handler SHOULD provide TypeScript module augmentation for `DefineApiInject`.

## Examples

### Hand-written lifecycle plugin

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

### Config layering with code priority

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

In the final resolved config:

- plugin id is `auth`, therefore runtime `name === 'auth'`
- plugin source comes from the `type` in config
- `secret` resolves to `'from-code'`
- `provider` remains `'jwt'`
