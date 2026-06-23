# Node Utils Guide

Use this guide when you need Node.js-only helpers for FaasJS runtime bootstrapping, local tooling, config resolution, or logging.

## Applicable Scenarios

- Running a handler, CLI, or test directly in Node.js
- Reading staged `faas.yaml` configuration
- Loading plugins, API handler modules, or packages dynamically
- Registering runtime module hooks for lifecycle or instrumentation
- Validating boundary inputs with Zod schema-based parsing
- Setting up a custom Node-side logger

## What `@faasjs/node-utils` Gives You

- config loading: `loadConfig`
- API loading: `loadApiHandler`, `loadPlugins`
- Node module bootstrapping: `loadPackage`, `registerNodeModuleHooks`, `resetRuntime`
- filesystem containment checks: `isPathInsideRoot` (see Validation Guide)
- schema parsing: `parseSchemaValue`, `formatSchemaError`, `SchemaOutput` (see Validation Guide)
- logging and log shipping: `Logger`, `formatLogger`, `getTransport`, `Transport`, `colorize`

## Default Workflow

1. Keep `@faasjs/node-utils` imports in Node-only entrypoints, tests, CLIs, or adapters.
2. Let `Server` or `viteFaasJsServer()` auto-load the project `.env` when they own bootstrap from a FaasJS app root, and call Node's built-in `loadEnvFile()` yourself in `faas run` entry files, plain Node scripts, tests, or other entrypoints that read env before those helpers start.
3. Use `loadConfig()` when you only need staged `faas.yaml` data.
4. Use `parseYaml()` from `@faasjs/utils` when you need the raw FaasJS YAML subset in custom tooling without staged discovery (see YAML Guide).
5. Use `loadApiHandler()` when you need the final exported handler from a default-exported FaasJS API module, or `loadPlugins()` when you already have a `Func` instance.
6. Prefer the FaasJS TypeScript loader when direct Node execution must understand local TypeScript files or tsconfig aliases, keep local imports extensionless without `.ts` or `.tsx` suffixes, and use default exports for modules loaded through `loadPackage()`.
7. Use `isPathInsideRoot()` before reading or loading root-scoped files from user-controlled or URL-derived paths.
8. Use `parseSchemaValue()` for custom Node-side boundaries that need the same optional Zod schema parsing and error formatting as FaasJS APIs and jobs.
9. Reuse `Logger` and the shared transport instead of building a custom logging wrapper.

## Rules

### 1. Keep `node-utils` in Node-only code paths

- This package depends on Node APIs such as `node:module`, `node:process`, and filesystem access.
- Do not import it into browser code, React components, or code that must run on edge runtimes.
- Use `@faasjs/utils` for portable helpers and `@faasjs/core` or `@faasjs/dev` for framework/runtime primitives.

### 2. Load `.env` files early when your entrypoint needs them

- `@faasjs/core` `Server` and `@faasjs/dev` `viteFaasJsServer()` already try to load the project `.env` before handlers run when they start from a FaasJS app root.
- `loadEnvFile()` from `node:process` is still the direct entrypoint for `faas run` entry files, local scripts, tests, CLIs, and config files that read `process.env` before those helpers start.
- Call it before reading `process.env`, building config objects, or loading modules that depend on env values.
- Keeping an explicit `loadEnvFile()` in `server.ts` is still a good default when your bootstrap does work before `new Server(...)` or when the same file can run through `faas run`.
- Wrap it in `try/catch` when the env file is optional and startup should continue without it.

```ts
import { loadEnvFile } from 'node:process'

try {
  loadEnvFile()
} catch (error) {
  console.warn('Failed to load env file', error)
}
```

### 3. Let `loadConfig()` resolve staged `faas.yaml`

- Do not reimplement directory walking or manual deep merging for `faas.yaml`.
- `loadConfig()` walks from project root to the target API directory, merges nested files, applies `defaults`, and annotates plugin entries with their resolved `name`.
- Relative plugin `type` values in YAML are resolved from the `faas.yaml` file that declared them, including `./plugin.ts` and `file://./plugin.ts`.
- `loadConfig()` validates the YAML shape and preserves custom stage fields, but it does not instantiate plugin classes.
- This keeps runtime behavior consistent with FaasJS plugin loading.

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.api.ts', 'production')

console.log(config.plugins?.http)
```

### 4. Pick the smallest loader for the job

- Use `loadConfig()` when you need staged `faas.yaml` resolution with directory walking and merging.
- Use `loadApiHandler()` when you need the final handler that a runtime or test will invoke; the API module must default-export a FaasJS API instance.
- Use `loadPlugins()` when you already have a `Func` instance and want YAML-driven plugins and config attached before exporting or mounting it.
- `loadPlugins()` merges YAML plugin config with inline `func.config.plugins`; inline config wins, existing plugin instances are configured in place, and missing YAML plugins are instantiated.
- Only `http` gets a built-in plugin type. Other YAML plugins need an explicit `type`, and config-driven plugin modules must default-export a plugin class with `onMount` or `onInvoke`.
- Use `loadPackage()` for default-export dynamic module loading in Node.js, especially when the target is a local TypeScript file or a path-alias-aware module.
- `loadPackage()` returns only `module.default`; named exports are not fallback values.
- Prefer these helpers over ad hoc `import()` wrappers so cache busting, tsconfig resolution, and plugin wiring stay consistent.

```ts
import { loadEnvFile } from 'node:process'
import { loadApiHandler } from '@faasjs/node-utils'

loadEnvFile()

const handler = await loadApiHandler(
  process.cwd(),
  '/project/src/orders/create.api.ts',
  process.env.FaasEnv || 'development',
)

const result = await handler(event, context)
```

### 5. Register module hooks only at process bootstrap

- `registerNodeModuleHooks()` is for long-lived Node entrypoints such as CLIs, dev servers, or bootstrap scripts that need tsconfig path alias resolution.
- Prefer the preload entry `node --import @faasjs/node-utils/register-hooks <entry>` for direct Node execution so scripts keep standard extensionless local imports.
- Call it once near startup. Repeated calls are safe, but scattering it across modules makes startup intent harder to follow.
- In isolated tests that depend on fresh loader state, call `resetRuntime()` between cases instead of reinitializing the whole process.

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})

await import('./scripts/sync-users')
```

### 6. Keep Node-side logging on the shared primitives

- Use `Logger` for structured levels, labels, timers, and environment-driven verbosity.
- Use `getTransport()` only when logs must be buffered and forwarded to another sink.
- `Logger` defaults to `info` level, a 1000-character truncation threshold for debug/info output, auto-detected terminal colors, and shared transport forwarding outside Vitest.
- `colorize()` and `formatLogger()` are lower-level helpers; prefer the `Logger` class unless you are implementing logging infrastructure.
- `colorize()` always emits ANSI escapes; let `Logger` decide whether output should be colorized.

### 7. Use schema helpers for custom Node boundaries

- Use `parseSchemaValue()` when a boundary has an optional Zod schema and needs consistent fallback and error formatting.
- Without a schema, it returns `defaultValue` (or `{}`) and ignores the raw value.
- With a schema, `null` and `undefined` are replaced by `defaultValue` (or `{}`) before `safeParseAsync()`.
- See Validation Guide for `parseSchemaValue`, `formatSchemaError`, and `SchemaOutput` patterns.

### 8. Validate root-scoped file paths with `isPathInsideRoot()`

See Validation Guide for `isPathInsideRoot` patterns.

## Review Checklist

- `@faasjs/node-utils` imports stay in Node-only code
- `faas run` entry files and local scripts load `.env` before env-dependent bootstrap logic unless `Server` or `viteFaasJsServer()` fully owns that bootstrap
- staged `faas.yaml` is read through `loadConfig()` or `loadApiHandler()`, not custom merge code
- relative YAML plugin `type` values are left for `loadConfig()`/`loadPlugins()` to normalize
- loaders use `loadApiHandler()`, `loadPlugins()`, or `loadPackage()` instead of custom dynamic import wrappers
- modules loaded through `loadPackage()` and config-driven plugin modules use default exports
- non-`http` YAML plugins declare an explicit `type`
- module hooks are registered at process startup, not deep inside feature code
- custom Node-side boundary validation uses `parseSchemaValue()` (see Validation Guide)
- root-scoped file access validates resolved paths with `isPathInsideRoot()` (see Validation Guide)
- tests that depend on fresh loader state use `resetRuntime()`
- logging uses `Logger` or the shared transport instead of raw `console` wrappers
