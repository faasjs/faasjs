# Node Utils Guide

Use this guide when you need Node.js-only helpers for FaasJS runtime bootstrapping, local tooling, config resolution, or logging.

## Use This Guide When

- running FaasJS handlers, CLIs, tests, or bootstrap scripts directly in Node.js
- loading `.env` files before bootstrapping the app
- reading merged staged `faas.yaml` config for a specific function file
- turning a function module into a runnable exported handler
- loading YAML-defined plugins into a `Func` instance
- importing local TypeScript modules with tsconfig path aliases in plain Node
- sharing runtime logs or shipping them through a transport

## What `@faasjs/node-utils` Gives You

- environment and config loading: `loadEnvFileIfExists`, `loadConfig`
- function loading: `loadFunc`, `loadPlugins`
- Node module bootstrapping: `loadPackage`, `registerNodeModuleHooks`, `detectNodeRuntime`, `resetRuntime`
- logging and log shipping: `Logger`, `formatLogger`, `getTransport`, `Transport`, `colorfy`

## Default Workflow

1. Keep `@faasjs/node-utils` imports in Node-only entrypoints, tests, CLIs, or adapters.
2. Load env files early with `loadEnvFileIfExists()` if the process relies on local dotenv files.
3. Use `loadConfig()` when you only need staged `faas.yaml` data.
4. Use `loadFunc()` when you need the final exported handler, or `loadPlugins()` when you already have a `Func` instance.
5. Use `loadPackage()` or `registerNodeModuleHooks()` when direct Node execution must understand local TypeScript files or tsconfig aliases.
6. Reuse `Logger` and the shared transport instead of building a custom logging wrapper.

## Rules

### 1. Keep `node-utils` in Node-only code paths

- This package depends on Node APIs such as `node:module`, `node:process`, and filesystem access.
- Do not import it into browser code, React components, or code that must run on edge runtimes.
- Use `@faasjs/utils` for portable helpers and `@faasjs/core` or `@faasjs/dev` for framework/runtime primitives.

### 2. Load `.env` files explicitly and early

- `loadEnvFileIfExists()` is the small, safe entrypoint when local scripts or tests depend on dotenv files.
- Call it before reading `process.env`, building config objects, or loading modules that depend on env values.
- It returns the resolved filename or `null`, which is useful for debug logs.

```ts
import { loadEnvFileIfExists, Logger } from '@faasjs/node-utils'

const logger = new Logger('bootstrap')
const envFile = loadEnvFileIfExists({
  cwd: process.cwd(),
  filename: '.env.local',
})

logger.info('env file: %s', envFile || 'not found')
```

### 3. Let `loadConfig()` resolve staged `faas.yaml`

- Do not reimplement directory walking or manual deep merging for `faas.yaml`.
- `loadConfig()` walks from project root to the function directory, merges nested files, applies `defaults`, and annotates plugin entries with their resolved `name`.
- This keeps runtime behavior consistent with FaasJS plugin loading.

```ts
import { loadConfig } from '@faasjs/node-utils'

const config = loadConfig(process.cwd(), '/project/src/orders/create.func.ts', 'production')

console.log(config.plugins?.http)
```

### 4. Pick the smallest loader for the job

- Use `loadFunc()` when you need the final handler that a runtime or test will invoke.
- Use `loadPlugins()` when you already have a `Func` instance and want YAML-driven plugins and config attached before exporting or mounting it.
- Use `loadPackage()` for general dynamic module loading in Node.js, especially when the target is a local TypeScript file or a path-alias-aware module.
- Prefer these helpers over ad hoc `import()` wrappers so cache busting, tsconfig resolution, and plugin wiring stay consistent.

```ts
import { loadEnvFileIfExists, loadFunc } from '@faasjs/node-utils'

loadEnvFileIfExists()

const handler = await loadFunc(
  process.cwd(),
  '/project/src/orders/create.func.ts',
  process.env.NODE_ENV || 'development',
)

const result = await handler(event, context)
```

### 5. Register module hooks only at process bootstrap

- `registerNodeModuleHooks()` is for long-lived Node entrypoints such as CLIs, dev servers, or bootstrap scripts that need tsconfig path alias resolution.
- Call it once near startup. Repeated calls are safe, but scattering it across modules makes startup intent harder to follow.
- In isolated tests that depend on fresh loader state, call `resetRuntime()` between cases instead of reinitializing the whole process.

```ts
import { registerNodeModuleHooks } from '@faasjs/node-utils'

registerNodeModuleHooks({
  root: process.cwd(),
})

await import('./scripts/sync-users.ts')
```

### 6. Keep Node-side logging on the shared primitives

- Use `Logger` for structured levels, labels, timers, and environment-driven verbosity.
- Use `getTransport()` only when logs must be buffered and forwarded to another sink.
- `colorfy()` and `formatLogger()` are lower-level helpers; prefer the `Logger` class unless you are implementing logging infrastructure.

## Review Checklist

- `@faasjs/node-utils` imports stay in Node-only code
- local scripts load `.env` before env-dependent bootstrap logic
- staged `faas.yaml` is read through `loadConfig()` or `loadFunc()`, not custom merge code
- loaders use `loadFunc()`, `loadPlugins()`, or `loadPackage()` instead of custom dynamic import wrappers
- module hooks are registered at process startup, not deep inside feature code
- tests that depend on fresh loader state use `resetRuntime()`
- logging uses `Logger` or the shared transport instead of raw `console` wrappers

## Read Next

- [Logger Guide](./logger.md)
- [@faasjs/node-utils package reference](../references/packages/node-utils/README.md)
- [loadEnvFileIfExists](../references/packages/node-utils/functions/loadEnvFileIfExists.md)
- [loadConfig](../references/packages/node-utils/functions/loadConfig.md)
- [loadFunc](../references/packages/node-utils/functions/loadFunc.md)
- [loadPackage](../references/packages/node-utils/functions/loadPackage.md)
- [loadPlugins](../references/packages/node-utils/functions/loadPlugins.md)
- [registerNodeModuleHooks](../references/packages/node-utils/functions/registerNodeModuleHooks.md)
