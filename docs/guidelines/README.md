# Best Practices

Use these guides and specifications as the current public guidance for building with FaasJS.

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. The main path is React, Ant Design, typed APIs, PostgreSQL, validation, testing, plugins, and stable project conventions.

## Main Path

Read these guides in order when starting a new feature or asking an AI coding agent to build one:

1. [Curated Stack Guide](/guidelines/curated-stack.html)
2. [Project Config Guide](/guidelines/project-config.html)
3. [File Conventions](/guidelines/file-conventions.html)
4. [defineApi Guide](/guidelines/define-api.html)
5. [React Data Fetching Guide](/guidelines/react-data-fetching.html)
6. [Ant Design Guide](/guidelines/ant-design.html)
7. [PG Query Builder and Raw SQL Guide](/guidelines/pg-query-builder.html)
8. [PG Schema and Migrations Guide](/guidelines/pg-schema-and-migrations.html)
9. [PG Testing Guide](/guidelines/pg-testing.html)
10. [Application Slices Guide](/guidelines/application-slices.html)

FaasJS favors complete application slices over generator-heavy workflows. A slice should keep UI, API, validation, database changes, and tests easy to find, review, and modify together.

## Guidelines

- [Curated Stack Guide](/guidelines/curated-stack.html): Use this guide when choosing defaults, reviewing architecture, or asking an AI coding agent to build a FaasJS feature.
- [Application Slices Guide](/guidelines/application-slices.html): Use this guide when adding a business feature to a FaasJS app or asking an AI coding agent to build one.
- [Project Config Guide](/guidelines/project-config.html): Use for `tsconfig.json`, `vite.config.ts`, and shared workspace tooling config in FaasJS projects.
- [File Conventions](/guidelines/file-conventions.html): Use this guide when creating or reviewing frontend pages, React components, hooks, FaasJS backend route files, or background job files.
- [Code Comments Guide](/guidelines/code-comments.html): Use for source JSDoc, helper comments, and short intent notes in FaasJS apps or packages. Docs pages and tutorials may use page-specific structure instead.
- [defineApi Guide](/guidelines/define-api.html): When implementing or reviewing a FaasJS HTTP endpoint, default to `defineApi`.
- [Jobs Guide](/guidelines/jobs.html): Use this guide when defining `.job.ts` background jobs, enqueueing asynchronous work, or running FaasJS workers and schedulers.
- [Testing Guide](/guidelines/testing.html): Use this guide when writing or reviewing tests in FaasJS projects.
- [React Guide](/guidelines/react.html): Use for React pages, components, hooks, dependency handling, derived state, and `@faasjs/react` helpers in FaasJS projects.
- [React Data Fetching Guide](/guidelines/react-data-fetching.html): Use for FaasJS requests in React: `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, `withFaasData`, client setup, loading, error, retry, debounce, polling, and reload behavior.
- [React Testing Guide](/guidelines/react-testing.html): Use this guide when writing or reviewing React tests that exercise FaasJS request flows in hooks or components.
- [Ant Design Guide](/guidelines/ant-design.html): Use when building or reviewing `@faasjs/ant-design` pages, CRUD surfaces, routes, app feedback, modals, and drawers.
- [Node Utils Guide](/guidelines/node-utils.html): Use this guide when you need Node.js-only helpers for FaasJS runtime bootstrapping, local tooling, config resolution, or logging.
- [Logger Guide](/guidelines/logger.html): Use this guide when working with `Logger` instances, log levels, timing, and transport configuration in FaasJS apps.
- [Utils Guide](/guidelines/utils.html): Use this guide when you need lightweight helper functions from `@faasjs/utils` in app code, tests, or runtime adapters.
- [PG Query Builder and Raw SQL Guide](/guidelines/pg-query-builder.html): Use this guide when building SQL queries with `@faasjs/pg` in FaasJS apps.
- [PG Table Types Guide](/guidelines/pg-table-types.html): Use this guide when defining or updating table types with `@faasjs/pg` declaration merging.
- [PG Schema and Migrations Guide](/guidelines/pg-schema-and-migrations.html): Use this guide when creating or reviewing database schema changes, migrations, or table structures with `@faasjs/pg`.
- [PG Testing Guide](/guidelines/pg-testing.html): Use this guide when writing or reviewing tests that use `@faasjs/pg` or `@faasjs/pg-dev` in FaasJS projects.
- [CLI and Tooling Guide](/guidelines/cli-and-tooling.html): Use this guide when running CLI commands, troubleshooting command errors, or choosing the right tool for the task. It is a quick-reference for the FaasJS toolchain to reduce command-execution mistakes.
- [CRUD Patterns Guide](/guidelines/crud-patterns.html): Use this guide when implementing or reviewing a standard CRUD feature — list, detail, create, update, delete — in a FaasJS application. It covers the full vertical slice from API endpoints to React pages.
- [Getting Started Guide](/guidelines/getting-started.html): Use this guide when starting a new FaasJS project or onboarding a new developer to an existing FaasJS codebase. It walks through the full setup, first feature, and daily workflow so both humans and AI coding agents can get productive quickly.
- [HTTP Plugin Guide](/guidelines/http-plugin.html): Use this guide when working with cookies, sessions, response helpers, or HTTP plugin configuration in FaasJS APIs.
- [JSON Guide](/guidelines/json.html): Use this guide when you need to parse, serialize, or normalize JSON data in FaasJS projects using the helpers from `@faasjs/utils`.
- [Middleware Guide](/guidelines/middleware.html): Use this guide when you need to serve static files in a FaasJS application.
- [Naming Convention](/guidelines/naming-convention.html): Use this guide when naming identifiers — functions, variables, types, files, and directories.
- [Plugins Guide](/guidelines/plugins.html): Use this guide when adding cross-cutting behavior that should run before or after every request — such as auth, tenant resolution, request logging, rate limiting, or feature flags. Plugins hook into the FaasJS request lifecycle and can inject typed fields into `defineApi` and `defineJob` handlers.
- [Validation Guide](/guidelines/valid.html): Use this guide when you need to validate data in FaasJS projects — whether at system boundaries, in custom Node-side code, or in portable helpers.
- [YAML Guide](/guidelines/yaml.html): Use this guide when you need to parse YAML text directly in FaasJS projects using `parseYaml` from `@faasjs/utils`.

## API Docs

- [@faasjs/core](/doc/core/)
- [@faasjs/dev](/doc/dev/)
- [@faasjs/react](/doc/react/)
- [@faasjs/ant-design](/doc/ant-design/)
- [@faasjs/node-utils](/doc/node-utils/)
- [@faasjs/jobs](/doc/jobs/)
- [@faasjs/pg](/doc/pg/)
- [@faasjs/pg-dev](/doc/pg-dev/)
- [@faasjs/types](/doc/types/)
- [@faasjs/utils](/doc/utils/)
- [create-faas-app](/doc/create-faas-app/)
