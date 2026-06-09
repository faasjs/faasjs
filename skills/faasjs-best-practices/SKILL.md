---
name: faasjs-best-practices
description: Use when building, reviewing, or testing FaasJS projects, including defineApi, useFaas, @faasjs/pg, @faasjs/ant-design, faas.yaml, jobs, plugins, validation, vp CLI, TypeScript config, and project conventions.
---

## CheatSheet

Quick reference for AI agents. See linked guides for details when a rule does not cover your scenario.

### Commands

| Command                            | Purpose                                                  |
| ---------------------------------- | -------------------------------------------------------- |
| `vp dev`                           | Start dev server                                         |
| `vp test` / `vp test <pattern>`    | Run tests                                                |
| `vp check --fix`                   | Lint + format (oxlint + oxfmt)                           |
| `npx create-faas-app --name <app>` | Scaffold a new FaasJS app                                |
| `npx faas types`                   | Regenerate API type declarations after `.api.ts` changes |
| `npx faasjs-pg migrate`            | Run pending DB migrations (`DATABASE_URL` required)      |
| `npx faasjs-pg sql "<sql>"`        | Execute SQL and print JSON (`DATABASE_URL` required)     |
| `npx faasjs-pg new <name>`         | Create timestamped migration file                        |

### File Layout

| Layer      | Pattern                                    | Example                            |
| ---------- | ------------------------------------------ | ---------------------------------- |
| Feature UI | `features/<feature>/index.tsx`             | `features/users/index.tsx`         |
| Component  | `features/<feature>/components/<Name>.tsx` | `components/UserTable.tsx`         |
| Hook       | `features/<feature>/hooks/use<Name>.ts`    | `hooks/useUserItems.ts`            |
| API        | `features/<feature>/api/<action>.api.ts`   | `api/list.api.ts`                  |
| API test   | `…/api/__tests__/<action>.test.ts`         | `__tests__/list.test.ts`           |
| Job        | `features/<feature>/jobs/<name>.job.ts`    | `jobs/sync.job.ts`                 |
| CLI        | `features/<feature>/cli/<command>.ts`      | `cli/import.ts`                    |
| Table type | `db/tables/<table_name>.ts`                | `db/tables/users.ts`               |
| Migration  | `db/migrations/<timestamp>-<name>.ts`      | `…/20250101000000-create-users.ts` |

Tests live in `__tests__/` inside the feature folder they protect. Fixtures/mocks go inside `__tests__/` too, not as siblings.

### Core Rules

- **Validation**: zod for external input (`defineApi` schema). `typeof`/`instanceof`/`=== null` for internal control flow. Do not swap them.
- **React**: no `useEffect`. Use `useStates` instead of `useState`; use `useStatesRef` when the same state also needs refs. Use `useEqualEffect` for side effects. Object/array deps → `useEqualMemo`/`useEqualCallback`. Keep React event handlers inline by default, even when non-trivial; extract only for reuse or real boundaries.
- **Data fetching**: `useFaas` for component-owned requests. `faas` for event handlers. the `Form` `faas` prop for form submits. `useFaasStream` for streaming.
- **CRUD**: `Table` `faasData` prop list → `Description` `faasData` prop detail → `Form` `faas` prop create/edit → `faas` + modal for delete. Shared `items` in `use<Feature>Items` drives all three.
- **Types**: rely on inference first. Add explicit types only at API boundaries, shared contracts, or where inference is ambiguous.
- **Imports**: use tsconfig aliases when configured. Short relative imports for nearby files. No `.ts`/`.tsx` suffix.
- **Files**: keep under ~500 lines. Extract only at real boundaries (reuse, >20 line body).
- **Errors**: `HttpError` + explicit status for expected failures (400/401/403/404/409). `throw Error` for internal 500.
- **Security**: check user/tenant/permission scope before data access. Never log secrets/tokens/passwords.
- **Return values**: return directly, avoid single-use intermediate variables. Destructure React hook returns and the first handler parameter in `defineApi`/`defineJob`; do not destructure other function params.
- **Comments**: JSDoc for exported package API only. No comments on untouched code. Delete dead code, don't mark it.

### Gate

Before handoff: `vp check --fix && vp test`. If either can't run, record why.

## Global Rules

- Read `tsconfig.json` and any extended TypeScript config before choosing import paths.
- Prefer FaasJS TypeScript loader support for direct Node execution, and keep local TypeScript imports extensionless instead of adding `.ts` or `.tsx` suffixes.
- Prefer aliases already defined in TypeScript config over deep relative imports.
- Keep short relative imports for nearby files in the same feature or directory.
- Do not invent a new alias in code unless the corresponding `tsconfig.json` and runtime resolver are configured in the same change.
- Keep changes minimal and task-scoped: no extra features, drive-by refactors, opportunistic cleanup, feature flags, transition shims, or speculative future-proofing.
- Use zod for input validation at system boundaries (user input, external APIs, config files) where a schema defines the expected shape. Zod's `.safeParse()` provides type-safe validation with automatic type inference, eliminating handwritten validation functions and keeping types in sync.
- Keep internal runtime type checks (`typeof`, `instanceof`, `=== null/undefined`) as-is. Replacing these with zod would increase code volume and add parsing overhead with no benefit—they are control-flow predicates, not input validation. The rule is: zod for external input contracts, `typeof`/`instanceof` for internal type interrogation.
- Keep code direct: validate at system boundaries, fail fast on invalid internal data, and do not add silent fallbacks or impossible-case handling.
- Avoid unnecessary intermediate variables: return or pass values directly instead of assigning to a single-use variable. An intermediate variable is justified when it documents a non-trivial condition, is referenced more than once, or breaks a long chain for readability.
- Do not destructure function parameters except the first parameter of handlers passed to `defineApi` or `defineJob` (e.g., `handler({ params })`, `handler({ params, event })`, or `handler({ params, logger, job })`); access all other function, handler, component, hook, and callback parameters through the parameter object (e.g., `input.xxx`, `props.xxx`, or `data.xxx`) so the source of each value is immediately visible.
- Destructure React hook return values at the call site, including object and tuple returns from `useFaas`, `useFaasStream`, `useStates`, `useStatesRef`, and similar helpers. Use `const { data, loading } = useFaas(...)`, `const { keyword, setKeyword } = useStates(...)`, and `const { count, setCount, countRef } = useStatesRef({ count: 0 })` instead of keeping a `result` or `states` object and reading `result.xxx` or `states.xxx`.
- Do not create standalone type aliases or interfaces when TypeScript can infer the type from the expression, schema, or return statement; rely on inference first and add explicit types only at API boundaries, shared contracts, or where inference is ambiguous.
- Extract helpers, hooks, components, or abstractions only when they are reused, create a real boundary, or simplify a large block; keep one-off code inline unless the body is over about 20 lines.
- Document symbols exported from package public entrypoints with JSDoc. Add JSDoc for shared app exports when the caller contract is not obvious. Do not add comments, docstrings, or type annotations to untouched code.
- Delete confirmed-dead code directly instead of leaving temporary tricks such as `_unused` renames, type re-exports, or `// removed` markers.
- Keep files under about 500 lines by splitting along real boundaries before they grow too large.
- Treat `vp check --fix` and `vp test` as the default acceptance gates before handoff; if either cannot run, record the reason and the narrower validation that was completed.

## Security And Boundary Checklist

Use this checklist whenever code handles users, tenants, permissions, secrets, external input, or persistent data.

- Validate external input at the boundary with `defineApi` schemas, HTTP parsing, or the relevant integration adapter.
- Check whether the API needs current-user, tenant, organization, project, role, or permission scoping before reading or mutating data.
- Prefer project plugins for auth, tenant, request metadata, and other cross-cutting business context.
- Return expected client errors with explicit HTTP status codes; reserve unexpected `500` failures for internal failures.
- Do not log secrets, tokens, passwords, cookies, full sensitive payloads, or unredacted third-party responses.

## Guidelines

For new feature work or broad review, start with these guides in order:

1. [Curated Stack Guide](./guidelines/curated-stack.md)
2. [Project Config Guide](./guidelines/project-config.md)
3. [File Conventions](./guidelines/file-conventions.md)
4. [defineApi Guide](./guidelines/define-api.md)
5. [React Data Fetching Guide](./guidelines/react-data-fetching.md)
6. [Ant Design Guide](./guidelines/ant-design.md)
7. [PG Query Builder and Raw SQL Guide](./guidelines/pg-query-builder.md)
8. [PG Schema and Migrations Guide](./guidelines/pg-schema-and-migrations.md)
9. [PG Testing Guide](./guidelines/pg-testing.md)
10. [Application Slices Guide](./guidelines/application-slices.md)

For narrow tasks, load only the relevant guide from the sections below.

### Getting Started

Start here for new projects or onboarding.

- [Getting Started Guide](./guidelines/getting-started.md): Full setup, first feature walkthrough, project structure, key concepts, and daily workflow.
- [Application Slices Guide](./guidelines/application-slices.md): Vertical UI/API/database/test slices, recommended file layout, agent workflow, and why FaasJS avoids generator-heavy development.
- [Curated Stack Guide](./guidelines/curated-stack.md): Rails-inspired default stack, official React/Ant Design/PostgreSQL path, plugin extension boundaries, auth/permission scope, and replacement rules.

### Conventions

Read once, apply everywhere.

- [File Conventions](./guidelines/file-conventions.md): Where to place feature UI, components, hooks, and `.api.ts` files, plus when separate files are worth creating.
- [Naming Convention](./guidelines/naming-convention.md): Identifier naming (camelCase/PascalCase), file/directory naming, abbreviation rules, and cross-package consistency.
- [Code Comments Guide](./guidelines/code-comments.md): Package public JSDoc expectations, caller contract conventions, and when shared app exports need docs.

### Frontend

React + Ant Design patterns.

- [Ant Design Guide](./guidelines/ant-design.md): `@faasjs/ant-design` page structure, routing, CRUD composition, feature-local APIs, and UI feedback patterns.
- [React Guide](./guidelines/react.md): Component and hook patterns, avoiding native `useEffect`, and handling non-primitive dependencies safely.
- [React Data Fetching Guide](./guidelines/react-data-fetching.md): When to use `useFaas`, `useFaasStream`, `faas`, or wrapper components, and how to handle loading, error, and retry states.
- [React Testing Guide](./guidelines/react-testing.md): Request-related React testing with `setMock`, shared cleanup, `jsdom`, and common request-flow scenarios.

### Backend

API endpoints, jobs, and HTTP concerns.

- [defineApi Guide](./guidelines/define-api.md): Building `.api.ts` endpoints with `defineApi`, inline schemas, typed `params`, error handling, and validation.
- [Jobs Guide](./guidelines/jobs.md): `.job.ts` files, `defineJob`, `enqueueJob`, workers, scheduler cron enqueueing, retries, idempotency, and testing.
- [HTTP Plugin Guide](./guidelines/http-plugin.md): Cookie, Session, ContentType, response helpers, and HTTP plugin configuration.
- [Middleware Guide](./guidelines/middleware.md): staticHandler and useMiddleware for static file hosting.

### Database

PostgreSQL via `@faasjs/pg`.

- [PG Table Types Guide](./guidelines/pg-table-types.md): Declaration merging on `Tables`, concrete row shapes, and keeping query inference aligned with table definitions.
- [PG Query Builder and Raw SQL Guide](./guidelines/pg-query-builder.md): Preferring `QueryBuilder` clauses, choosing raw SQL fallbacks deliberately, and narrowing row shapes.
- [PG Schema and Migrations Guide](./guidelines/pg-schema-and-migrations.md): Timestamped migrations, `SchemaBuilder`, `TableBuilder`, and transactional schema changes.
- [PG Testing Guide](./guidelines/pg-testing.md): `PgVitestPlugin()`, shared `DATABASE_URL` bootstrap, and pairing runtime assertions with `expectTypeOf(...)`.

### Testing

General testing principles. Also see React Testing, PG Testing, and Jobs (for job-specific testing).

- [Testing Guide](./guidelines/testing.md): Choosing test level, keeping mock boundaries narrow, avoiding unnecessary mocks, and test placement.

### Advanced

Plugins, full CRUD slices, and cross-cutting concerns.

- [Plugins Guide](./guidelines/plugins.md): The `Plugin` interface, lifecycle methods, injecting fields via `DefineApiInject`, config-driven loading, and plugin testing.
- [CRUD Patterns Guide](./guidelines/crud-patterns.md): Complete CRUD vertical slice — shared items metadata, list/detail/create/update/delete patterns, testing, and agent efficiency tips.
- [Logger Guide](./guidelines/logger.md): When to reuse injected loggers versus creating `Logger` instances, log levels, and timing slow operations.
- [Code Comments Guide](./guidelines/code-comments.md): Already listed under Conventions; repeated here as a cross-cutting concern.

### Config & Tooling

Development workflow and project configuration.

- [CLI and Tooling Guide](./guidelines/cli-and-tooling.md): FaasJS CLI, Vite Plus commands, project scaffolding, migrations, type generation, testing, common errors, and environment variables.
- [Project Config Guide](./guidelines/project-config.md): Keeping `tsconfig.json`, `vite.config.ts`, and shared tooling config aligned with FaasJS defaults.
- [Node Utils Guide](./guidelines/node-utils.md): Node-only helpers for env/config loading, function and plugin bootstrapping, module loading, and shared logging.

### Utility Libraries

Portable helpers from `@faasjs/utils`.

- [Utils Guide](./guidelines/utils.md): Deep merging and converting text to and from streams.
- [JSON Guide](./guidelines/json.md): JSON parsing and streaming helpers.
- [Validation Guide](./guidelines/valid.md): Data validation and type guard helpers.
- [YAML Guide](./guidelines/yaml.md): Direct YAML parsing with `parseYaml`.

### Specifications

Normative specifications for FaasJS runtime behavior. Use MUST/SHOULD/MAY language.

- [faas.yaml Specification](./guidelines/faas-yaml.md): Full faas.yaml configuration reference — file placement, discovery, merge order, staging keys, supported YAML subset.
- [Routing Mapping Specification](./guidelines/routing-mapping.md): Zero-Mapping route resolution — file naming, search order, and fallback chain.
- [HTTP Protocol Specification](./guidelines/http-protocol.md): Request/response transport baseline — POST convention, JSON body, status codes, `data`/`error` response envelope.
- [Plugin Specification](./guidelines/plugin.md): Plugin identity, lifecycle execution, config layering, manual registration, and config-driven loading contract.
