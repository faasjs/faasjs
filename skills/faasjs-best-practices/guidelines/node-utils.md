# Node Utils Guide

Use this guide when you need Node.js-only helpers for FaasJS runtime bootstrapping, local tooling, config resolution, or logging.

## What `@faasjs/node-utils` Gives You

- config loading: `loadConfig`, `parseYaml`
- API loading: `loadApiHandler`, `loadPlugins`
- Node module bootstrapping: `loadPackage`, `registerNodeModuleHooks`, `detectNodeRuntime`, `resetRuntime`
- filesystem containment checks: `isPathInsideRoot`
- schema parsing: `parseSchemaValue`, `formatSchemaError`, `SchemaOutput`
- logging and log shipping: `Logger`, `formatLogger`, `getTransport`, `Transport`, `colorfy`

## Default Workflow

1. Keep `@faasjs/node-utils` imports in Node-only entrypoints, tests, CLIs, or adapters.
2. Let `Server` or `viteFaasJsServer()` auto-load the project `.env` when they own bootstrap from a FaasJS app root, and call Node's built-in `loadEnvFile()` yourself in `faas run` entry files, plain Node scripts, tests, or other entrypoints that read env before those helpers start.
3. Use `loadConfig()` when you only need staged `faas.yaml` data.
4. Use `parseYaml()` when you need the raw FaasJS YAML subset in custom tooling without staged discovery.
5. Use `loadApiHandler()` when you need the final exported handler, or `loadPlugins()` when you already have a `Func` instance.
6. Prefer the FaasJS TypeScript loader when direct Node execution must understand local TypeScript files or tsconfig aliases, and keep local imports extensionless without `.ts` or `.tsx` suffixes.
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
- This keeps runtime behavior consistent with FaasJS plugin loading.

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.api.ts', 'production')

console.log(config.plugins?.http)
```

### 4. Pick the smallest loader for the job

- Use `parseYaml()` when your script receives YAML text directly and you want the same supported subset and error messages as FaasJS config parsing.
- `parseYaml()` does not walk directories, apply staging fallbacks, or validate the `faas.yaml` schema, so validate the parsed shape yourself when you are not calling `loadConfig()`.
- Use `loadApiHandler()` when you need the final handler that a runtime or test will invoke.
- Use `loadPlugins()` when you already have a `Func` instance and want YAML-driven plugins and config attached before exporting or mounting it.
- Use `loadPackage()` for general dynamic module loading in Node.js, especially when the target is a local TypeScript file or a path-alias-aware module.
- Prefer these helpers over ad hoc `import()` wrappers so cache busting, tsconfig resolution, and plugin wiring stay consistent.

```ts
import { loadEnvFile } from 'node:process'
import { loadApiHandler, parseYaml } from '@faasjs/node-utils'

loadEnvFile()

const pluginDefaults = parseYaml(`defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: 'replace-me'
`)

const handler = await loadApiHandler(
  process.cwd(),
  '/project/src/orders/create.api.ts',
  process.env.FaasEnv || 'development',
)

console.log(pluginDefaults)
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
- `colorfy()` and `formatLogger()` are lower-level helpers; prefer the `Logger` class unless you are implementing logging infrastructure.

### 7. Use schema helpers for custom Node boundaries

- `defineApi` and `defineJob` already parse their own schemas, so application handlers should use their injected `params`.
- Use `parseSchemaValue()` when a CLI, worker adapter, loader, or other Node-only boundary needs the same optional-schema behavior; omitted schemas and nullish input default to `{}` unless you pass `defaultValue`.
- Use `SchemaOutput<TSchema, TFallback>` when a public helper type should follow a Zod schema output type and fall back when the schema is omitted.
- Use `formatSchemaError()` only when you need the formatted validation message without throwing.

```ts
import { parseSchemaValue } from '@faasjs/node-utils'
import * as z from 'zod'

const params = await parseSchemaValue({
  schema: z.object({
    count: z.coerce.number().int().positive(),
  }),
  value: input,
  errorMessage: 'Invalid params',
})
```

### 8. Validate root-scoped file paths with `isPathInsideRoot()`

- Use `isPathInsideRoot()` before opening files resolved from request URLs, CLI arguments, config values, or any other user-controlled fragments.
- It normalizes both paths, follows existing symlinks with `realpath`, and still handles missing target files by normalizing through the nearest existing parent directory.
- This makes it suitable for guarding static file serving, route lookup, template resolution, or any logic that must reject `../` traversal and symlink escapes.
- Resolve the candidate path first, then validate that resolved path against the intended root.

```ts
import { isPathInsideRoot } from '@faasjs/node-utils'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'public')
const candidate = resolve(root, requestPath)

if (!isPathInsideRoot(candidate, root)) {
  throw Error('Path escapes the static root')
}
```

## Review Checklist

- `@faasjs/node-utils` imports stay in Node-only code
- `faas run` entry files and local scripts load `.env` before env-dependent bootstrap logic unless `Server` or `viteFaasJsServer()` fully owns that bootstrap
- staged `faas.yaml` is read through `loadConfig()` or `loadApiHandler()`, not custom merge code
- raw FaasJS YAML parsing uses `parseYaml()` instead of a different YAML parser
- loaders use `loadApiHandler()`, `loadPlugins()`, or `loadPackage()` instead of custom dynamic import wrappers
- module hooks are registered at process startup, not deep inside feature code
- custom Node-side boundary validation uses `parseSchemaValue()` instead of one-off Zod error formatting
- root-scoped file access validates resolved paths with `isPathInsideRoot()`
- tests that depend on fresh loader state use `resetRuntime()`
- logging uses `Logger` or the shared transport instead of raw `console` wrappers
