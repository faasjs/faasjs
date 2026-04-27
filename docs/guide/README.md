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
10. [Plugin Specification](/specs/plugin.html)
11. [Application Slices Guide](/guidelines/application-slices.html)

FaasJS favors complete application slices over generator-heavy workflows. A slice should keep UI, API, validation, database changes, and tests easy to find, review, and modify together.

## Guidelines

- [Curated Stack Guide](/guidelines/curated-stack.html): Use this guide when choosing defaults, reviewing architecture, or asking an AI coding agent to build a FaasJS feature.
- [Application Slices Guide](/guidelines/application-slices.html): Use this guide when adding a business feature to a FaasJS app or asking an AI coding agent to build one.
- [Project Config Guide](/guidelines/project-config.html): Use for `tsconfig.json`, `vite.config.ts`, and shared workspace tooling config.
- [File Conventions](/guidelines/file-conventions.html): Use this guide when creating or reviewing frontend pages, React components, hooks, FaasJS backend route files, or background job files.
- [Code Comments Guide](/guidelines/code-comments.html): Use for source JSDoc, helper comments, and short intent notes in FaasJS apps or packages. Docs pages and tutorials may use page-specific structure instead.
- [defineApi Guide](/guidelines/define-api.html): When implementing or reviewing a FaasJS HTTP endpoint, default to `defineApi`.
- [Jobs Guide](/guidelines/jobs.html): Use this guide when defining `.job.ts` background jobs, enqueueing asynchronous work, or running FaasJS workers and schedulers.
- [Testing Guide](/guidelines/testing.html): Use this guide when writing or reviewing tests in FaasJS projects.
- [React Guide](/guidelines/react.html): Use for React pages, components, hooks, dependency handling, derived state, and `@faasjs/react` helpers.
- [React Data Fetching Guide](/guidelines/react-data-fetching.html): Use for FaasJS requests in React: `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, `withFaasData`, client setup, loading, error, retry, debounce, polling, and reload behavior.
- [React Testing Guide](/guidelines/react-testing.html): Use this guide when writing or reviewing React tests that exercise FaasJS request flows in hooks or components.
- [Ant Design Guide](/guidelines/ant-design.html): Use for `@faasjs/ant-design` pages, CRUD surfaces, routes, app feedback, modals, and drawers.
- [Node Utils Guide](/guidelines/node-utils.html): Use this guide when you need Node.js-only helpers for FaasJS runtime bootstrapping, local tooling, config resolution, or logging.
- [Logger Guide](/guidelines/logger.html): Use this guide when you need readable runtime logs in FaasJS handlers, middleware, background jobs, server hooks, or standalone Node.js scripts.
- [Utils Guide](/guidelines/utils.html): Use this guide when you need lightweight helper functions from `@faasjs/utils` in app code, tests, or runtime adapters.
- [PG Query Builder and Raw SQL Guide](/guidelines/pg-query-builder.html): When implementing or reviewing `@faasjs/pg` query code, default to the fluent `QueryBuilder` surface, and fall back to `client.raw(...)` only when the builder cannot express the SQL cleanly.
- [PG Table Types Guide](/guidelines/pg-table-types.html): When implementing or reviewing `@faasjs/pg` table typing, default to declaration merging on `Tables`.
- [PG Schema and Migrations Guide](/guidelines/pg-schema-and-migrations.html): When implementing or reviewing DDL with `@faasjs/pg`, default to `SchemaBuilder`, `TableBuilder`, and timestamped migration files.
- [PG Testing Guide](/guidelines/pg-testing.html): When changing `@faasjs/pg`-backed code, every behavior change should come with runtime tests, and type-sensitive surface changes should come with `expectTypeOf(...)` coverage.

## Specifications

- [faas.yaml Configuration Specification](/specs/faas-yaml.html): `faas.yaml` is the runtime configuration entry used by FaasJS config loading, local dev server resolution, and type generation.
- [HTTP Protocol Specification](/specs/http-protocol.html): FaasJS request/response guidance is spread across multiple locations. This spec defines a single internal baseline for transport behavior.
- [Plugin Specification](/specs/plugin.html): Defines plugin identity, lifecycle execution, config layering, and config-driven loading.
- [Routing Mapping Specification](/specs/routing-mapping.html): Standardizes backend route mapping so file paths and request paths stay predictable.

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
