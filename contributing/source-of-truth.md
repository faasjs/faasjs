# Source Of Truth

Use this guide when developing or maintaining the FaasJS framework in this monorepo.

## Main Edit Locations

- Framework source: `packages/*/src`
- Templates and smoke-test references: `templates/*/src`
- Docs site content: `docs/**`
- User-facing skills and guidance: `skills/**`
- Framework contribution guides and maintainer workflows: `contributing/**`
- Docker image definitions and related assets: `images/**`
- Framework specifications: `skills/*/references/specs/**`

## Guide Boundaries

- `skills/**` is for public guidance aimed at people building with FaasJS.
- `contributing/**` is for framework contribution workflows and maintainer-facing rules.
- Keep repo-specific maintainer workflows, release steps, and validation requirements out of user-facing `skills/**`.

## Generated And Derived Files

- Do not hand-edit `dist/**`; those directories are generated artifacts.
- Do not directly edit generated API Markdown under `packages/*/{classes,functions,interfaces,type-aliases,variables}`.
- Update JSDoc in `packages/*/src` first, then run `vp run doc` to refresh generated package API Markdown.
- Do not hand-edit built docs output such as `docs/dist/**`.

## Codebase Conventions

The root [`vite.config.ts`](../vite.config.ts) is the source of truth for formatting, linting, packing, and test config.

- TypeScript + ESM throughout the repo
- Single quotes, no semicolons, sorted imports
- Prefer `import type` where appropriate
- Type-aware linting is enabled
- Root TS path aliases map `@faasjs/*` to `packages/*/src`

## Change Scope

- Keep changes scoped to the affected package, guide, or workflow.
- Avoid unrelated formatting churn, drive-by refactors, or opportunistic cleanup.
- When framework behavior, public APIs, file conventions, recommended usage, docs navigation, or public workflows change, also follow [`documentation-sync.md`](./documentation-sync.md).
