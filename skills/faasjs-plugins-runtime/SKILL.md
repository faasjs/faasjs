---
name: faasjs-plugins-runtime
description: 'Use when building or reviewing FaasJS plugins and runtime infrastructure: Plugin lifecycle hooks including concurrent mount and failed-mount retry behavior, InvokeData mutation, DefineApiInject module augmentation, faas.yaml plugin loading, applyConfig, logger usage, @faasjs/node-utils, loadConfig, loadDotenv, module loaders, and Node-only bootstrap code.'
---

# FaasJS Plugins And Runtime

## Default Workflow

1. Use plugins for cross-cutting business context such as auth, tenant, request metadata, and permission scope.
2. Implement plugin lifecycle hooks with clear ownership, retry-safe mount initialization, and exactly one `next()` call when required.
3. Provide injected field types through `DefineApiInject` module augmentation.
4. Prefer injected loggers when the framework provides one; create labeled loggers for standalone code.
5. Keep `@faasjs/node-utils` usage in Node-only bootstrapping and tooling paths.

## Load These References

- Plugin interface, lifecycle hooks, injected fields, config-driven loading, and tests: `references/guidelines/plugins.md`.
- Logger selection, levels, formatting, timing, and secret handling: `references/guidelines/logger.md`.
- `loadConfig`, `.env` loading, module hooks, schema helpers, and path containment: `references/guidelines/node-utils.md`.

## Gotchas

- Mutate `InvokeData` for injected fields and document the type surface with module augmentation.
- Keep `onMount` retry-safe: concurrent callers share one attempt, and a later call may retry after failure.
- Do not log secrets or full sensitive payloads.
- Keep module hook registration at process bootstrap.

## Validation

- Test plugins with real `Func` instances when behavior depends on lifecycle execution.
- Cover shared mount success, shared mount failure, and later retry when `onMount` owns resources.
- Run focused tests with `vp test <pattern>`.
- Run `vp check --fix` before handoff when plugin or runtime files changed.
