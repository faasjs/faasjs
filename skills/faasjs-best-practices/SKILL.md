---
name: faasjs-best-practices
description: When working with FaasJS projects, must follow these best practices to ensure code quality, maintainability, and testability.
---

## Start Here

Before changing code, inspect nearby examples and read only the guides needed for the task. Prefer project conventions over generic TypeScript, React, Node, or SQL patterns.

### Agent Task Routing

- New business feature or vertical slice: read [Application Slices Guide](./guidelines/application-slices.md), [File Conventions](./guidelines/file-conventions.md), then the relevant API, UI, PG, and testing guides below.
- New or changed `.api.ts` endpoint: read [defineApi Guide](./guidelines/define-api.md) and [Testing Guide](./guidelines/testing.md); also read PG guides if the endpoint touches data.
- New or changed `.job.ts` background job: read [Jobs Guide](./guidelines/jobs.md), [PG Query Builder and Raw SQL Guide](./guidelines/pg-query-builder.md), and [PG Testing Guide](./guidelines/pg-testing.md).
- React UI or request-flow change: read [React Guide](./guidelines/react.md), [React Data Fetching Guide](./guidelines/react-data-fetching.md), and [React Testing Guide](./guidelines/react-testing.md); read [Ant Design Guide](./guidelines/ant-design.md) for `@faasjs/ant-design` surfaces.
- Database schema, query, or type change: read [PG Schema and Migrations Guide](./guidelines/pg-schema-and-migrations.md), [PG Table Types Guide](./guidelines/pg-table-types.md), [PG Query Builder and Raw SQL Guide](./guidelines/pg-query-builder.md), and [PG Testing Guide](./guidelines/pg-testing.md).
- Project tooling or config change: read [Project Config Guide](./guidelines/project-config.md) before editing `tsconfig.json`, `vite.config.ts`, or shared tool config.
- Docs, generated references, translations, navigation, or changelog: follow the repo-level documentation sync guide before editing derived docs.

## Global Rules

- Read `tsconfig.json` and any extended TypeScript config before choosing import paths.
- Prefer FaasJS TypeScript loader support for direct Node execution, and keep local TypeScript imports extensionless instead of adding `.ts` or `.tsx` suffixes.
- Prefer aliases already defined in TypeScript config over deep relative imports.
- Keep short relative imports for nearby files in the same feature or directory.
- Do not invent a new alias in code unless the corresponding `tsconfig.json` and runtime resolver are configured in the same change.
- Keep changes minimal and task-scoped: no extra features, drive-by refactors, opportunistic cleanup, feature flags, transition shims, or speculative future-proofing.
- Keep code direct: validate at system boundaries such as user input and external APIs, fail fast on invalid internal data, and do not add silent fallbacks or impossible-case handling.
- Extract helpers, hooks, components, or abstractions only when they are reused, create a real boundary, or simplify a large block; keep one-off code inline unless the body is over about 20 lines.
- Document package public exports with JSDoc. Add JSDoc for shared app exports when the caller contract is not obvious. Do not add comments, docstrings, or type annotations to untouched code.
- Delete confirmed-dead code directly instead of leaving temporary tricks such as `_unused` renames, type re-exports, or `// removed` markers.
- Keep files under about 500 lines by splitting along real boundaries before they grow too large.
- Treat `vp check` and `vp test` as the default acceptance gates before handoff; if either cannot run, record the reason and the narrower validation that was completed.

## Security And Boundary Checklist

Use this checklist whenever code handles users, tenants, permissions, secrets, external input, or persistent data.

- Validate external input at the boundary with `defineApi` schemas, HTTP parsing, or the relevant integration adapter.
- Check whether the API needs current-user, tenant, organization, project, role, or permission scoping before reading or mutating data.
- Prefer project plugins for auth, tenant, request metadata, and other cross-cutting business context.
- Return expected client errors with explicit HTTP status codes; reserve unexpected `500` failures for internal failures.
- Do not log secrets, tokens, passwords, cookies, full sensitive payloads, or unredacted third-party responses.

## Definition Of Done

Before handoff, verify the smallest meaningful set for the change:

- Imports follow the local `tsconfig.json`, existing aliases, and extensionless local import rules.
- API changes include schema validation, typed `params`, narrow response shapes, and tests for success plus meaningful failure paths.
- Creating, renaming, or moving `.api.ts` files is followed by `faas types` or a recorded reason it could not run.
- Creating, renaming, or moving `.job.ts` files keeps `enqueueJob()` paths and worker/scheduler roots aligned.
- Database shape changes include a migration, table type updates, and PG tests or a recorded reason they are not needed.
- UI create/update/delete flows provide user feedback and refresh, close, or invalidate the affected surface intentionally.
- Tests mock only narrow external boundaries and keep FaasJS validation, plugins, and database behavior real when practical.
- Run targeted tests first when available, then `vp check` and `vp test` when practical; record any blocked commands and the validation that did run.

## Avoid By Default

- Do not add Rails-style generators, generic CRUD layers, broad repository abstractions, or speculative framework shims for a single slice.
- Do not bypass FaasJS wrappers with raw React, Ant Design, SQL, fetch, or test mocks when the curated helper fits.
- Do not add catch-all fallback branches for impossible internal states; fix the upstream invariant or fail fast.
- Do not introduce a second config, request, logging, or database bootstrap path unless the task explicitly requires it.

## Guidelines

- [Curated Stack Guide](./guidelines/curated-stack.md): Covers the Rails-inspired default stack, official React/Ant Design/PostgreSQL path, plugin extension boundaries, auth/permission scope, and replacement rules.
- [Application Slices Guide](./guidelines/application-slices.md): Covers vertical UI/API/database/test slices, recommended file layout, agent workflow, and why FaasJS avoids generator-heavy development.
- [Ant Design Guide](./guidelines/ant-design.md): Covers `@faasjs/ant-design` page structure, routing, CRUD composition, feature-local APIs, and UI feedback patterns.
- [File Conventions](./guidelines/file-conventions.md): Covers where to place pages, components, hooks, and `.api.ts` files, plus when separate files are worth creating.
- [Code Comments Guide](./guidelines/code-comments.md): Covers package public JSDoc expectations, caller contract conventions, when shared app exports need docs, and how to explain non-standard code without narrating it line by line.
- [Node Utils Guide](./guidelines/node-utils.md): Covers Node-only helpers for env/config loading, function and plugin bootstrapping, module loading, and shared logging.
- [Project Config Guide](./guidelines/project-config.md): Covers how to keep `tsconfig.json`, `vite.config.ts`, and shared tooling config aligned with FaasJS defaults.
- [Testing Guide](./guidelines/testing.md): Covers shared testing principles such as choosing test level, keeping mock boundaries narrow, and avoiding unnecessary mocks.
- [React Guide](./guidelines/react.md): Covers React component and hook patterns in FaasJS, especially avoiding native `useEffect` and handling non-primitive dependencies safely.
- [React Data Fetching Guide](./guidelines/react-data-fetching.md): Covers when to use `useFaas`, `useFaasStream`, `faas`, or wrapper components, and how to handle loading, error, and retry states.
- [React Testing Guide](./guidelines/react-testing.md): Covers request-related React testing with `setMock`, shared cleanup, `jsdom`, and common request-flow scenarios on top of the shared Testing Guide.
- [defineApi Guide](./guidelines/define-api.md): Covers building `.api.ts` endpoints with `defineApi`, inline schemas, typed `params`, error handling, and validation expectations.
- [Jobs Guide](./guidelines/jobs.md): Covers `.job.ts` files, `defineJob`, `enqueueJob`, workers, scheduler cron enqueueing, retries, idempotency, and testing.
- [Logger Guide](./guidelines/logger.md): Covers when to reuse injected loggers versus creating `Logger` instances, how to choose log levels, and how to time slow operations.
- [Utils Guide](./guidelines/utils.md): Covers portable helpers from `@faasjs/utils` for deep merging and converting text or JSON to and from streams.
- [PG Query Builder and Raw SQL Guide](./guidelines/pg-query-builder.md): Covers preferring `QueryBuilder` clauses, choosing raw SQL fallbacks deliberately, keeping client bootstrap consistent, and narrowing row shapes intentionally.
- [PG Table Types Guide](./guidelines/pg-table-types.md): Covers declaration merging on `Tables`, concrete row shapes, and keeping query inference aligned with table definitions.
- [PG Schema and Migrations Guide](./guidelines/pg-schema-and-migrations.md): Covers timestamped migrations, `SchemaBuilder`, `TableBuilder`, and transactional schema changes.
- [PG Testing Guide](./guidelines/pg-testing.md): Covers `TypedPgVitestPlugin()`, shared `DATABASE_URL` bootstrap, and pairing runtime assertions with `expectTypeOf(...)`.

## Specs

- [faas.yaml Configuration Specification](./references/specs/faas-yaml.md)
- [HTTP Protocol Specification](./references/specs/http-protocol.md)
- [Plugin Specification](./references/specs/plugin.md)
- [Routing Mapping Specification](./references/specs/routing-mapping.md)

## Packages

- [@faasjs/ant-design](./references/packages/ant-design/README.md)
- [@faasjs/core](./references/packages/core/README.md)
- [create-faas-app](./references/packages/create-faas-app/README.md)
- [@faasjs/dev](./references/packages/dev/README.md)
- [@faasjs/jobs](./references/packages/jobs/README.md)
- [@faasjs/pg](./references/packages/pg/README.md)
- [@faasjs/pg-dev](./references/packages/pg-dev/README.md)
- [@faasjs/node-utils](./references/packages/node-utils/README.md)
- [@faasjs/react](./references/packages/react/README.md)
- [@faasjs/types](./references/packages/types/README.md)
- [@faasjs/utils](./references/packages/utils/README.md)
