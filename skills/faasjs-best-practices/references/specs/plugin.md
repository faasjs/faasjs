# Plugin Specification

## Background

FaasJS supports plugins in two complementary ways:

- explicit plugin instances attached to `Func`
- config-driven plugin loading used by `defineApi()`

The runtime behavior is already stable across `@faasjs/core` and `@faasjs/node-utils`, but the contract is currently spread across source code, tests, and legacy docs.

This specification defines the current baseline for plugin identity, lifecycle execution, and config-driven loading.

Related references:

- `packages/core/src/func/index.ts`
- `packages/core/src/index.ts`
- `packages/node-utils/src/load_config.ts`
- `packages/core/src/plugins/http/index.ts`
- `docs/zh/guide/excel/plugin.md`

## Goals

- Keep plugin authoring and loading behavior predictable.
- Define how plugin identity, ordering, and deduplication work.
- Align config-driven loading with current `defineApi()` behavior.

## Non-goals

- Defining each plugin package's private `config` schema.
- Standardizing npm publishing, versioning, or marketplace metadata for plugins.

## Normative Rules

### 1. Runtime Plugin Contract

1. A plugin instance MUST expose string `type` and string `name` fields.
2. A plugin MAY implement `onMount`, `onInvoke`, or both.
3. Plugins auto-loaded by `defineApi()` MUST be created from a constructor whose prototype implements at least one lifecycle method: `onMount` or `onInvoke`.
4. Plugin `name` SHOULD stay stable within the same function because ordering, deduplication, logs, and config lookup rely on it.
5. Plugin `type` SHOULD identify the plugin family or module source, while `name` SHOULD identify the runtime instance.

### 2. Lifecycle Execution Model

1. User plugins MUST execute before the built-in run-handler plugin.
2. `onMount` hooks MUST run in plugin order and MUST run at most once per `Func` instance.
3. `onInvoke` hooks MUST run in plugin order for every invocation.
4. Plugins MUST use `await next()` to continue the lifecycle chain.
5. Calling `next()` multiple times from the same lifecycle hook MUST reject with `next() called multiple times`.
6. Plugins MAY mutate mount or invoke data to inject fields, prepare context, or control the final response.
7. Errors thrown by a plugin or downstream handler MUST stop the current chain and propagate to the caller.

### 3. Manual Registration

1. `new Func({ plugins: [...] })` MUST preserve the provided plugin order.
2. Manual plugin arrays MUST NOT perform implicit deduplication; callers are responsible for avoiding duplicate plugin names when that matters.

### 4. Config-Driven Loading In `defineApi()`

1. `defineApi()` MUST resolve `func.config.plugins` before the first mount or invoke.
2. The loader MUST inspect only own enumerable keys on `config.plugins`.
3. A string config entry MUST be treated as shorthand for plugin `type`.
4. For an object config entry, resolved plugin `name` MUST default to the entry key unless `name` is provided explicitly.
5. For an object config entry, resolved plugin `type` MUST default to `type`, then fall back to the entry key.
6. The loader MUST instantiate plugins with the resolved config object plus resolved `name` and `type`.
7. If a plugin with the same resolved `name` already exists on the function, config-driven loading MUST skip that duplicate entry.

### 5. Module And Constructor Resolution

1. Plugin type `http` and alias `@faasjs/http` MUST resolve to module `@faasjs/core`.
2. Unscoped bare plugin types such as `mysql` MUST resolve to `@faasjs/<type>`.
3. Scoped package names, relative paths, absolute paths, and `file://` local file URLs MUST resolve as authored after stripping an optional `npm:` prefix.
4. When resolving a class export from a module, the loader MUST first try normalized PascalCase class names derived from the plugin type or trailing path segments.
5. If the named class export is not available, the loader MUST fall back to the module's default export.
6. If neither export is a valid lifecycle plugin constructor, the loader MUST throw an error.
7. If constructor execution throws or returns a non-object plugin instance, the loader MUST throw an error.

### 6. `defineApi()` Requirements

1. A `defineApi()` function MUST have an `http` plugin available after plugin resolution.
2. If the `http` plugin is missing, invocation MUST fail with an error that indicates the required `http` plugin is missing.
3. Additional plugins MAY inject fields into the handler data by mutating invoke data before the business handler runs.
4. Plugin packages that inject extra handler fields SHOULD provide TypeScript module augmentation for `DefineApiInject`.

## Examples

### Manual lifecycle plugin

```ts
import { Func, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class TracePlugin implements Plugin {
  public readonly type = 'trace'
  public readonly name = 'trace'

  public async onInvoke(data: InvokeData, next: Next) {
    data.context.trace = ['before']
    await next()
    data.context.trace.push('after')
  }
}

export const func = new Func({
  plugins: [new TracePlugin()],
  async handler({ context }) {
    context.trace.push('handler')
    return context.trace
  },
})
```

### Config-driven plugin loading in `defineApi()`

```ts
import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ current_user }) {
    return {
      current_user,
    }
  },
})

func.config = {
  plugins: {
    auth: {
      type: './auth-plugin',
    },
    http: {
      config: {},
    },
  },
}
```
