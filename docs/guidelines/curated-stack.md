# Curated Stack Guide

Use this guide when choosing defaults, reviewing architecture, or asking an AI coding agent to build a FaasJS feature.

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. It gives projects a chef-selected main path instead of asking every team to assemble its own framework from independent tools.

## Default Stack

The curated FaasJS path is:

- React for frontend applications
- `@faasjs/ant-design` and Ant Design for business UI
- PostgreSQL for relational data
- `@faasjs/pg` for typed database queries, migrations, and table inference
- `@faasjs/jobs` for PostgreSQL-backed background jobs and scheduled job enqueueing
- `defineApi` for typed backend endpoints
- schema validation at system boundaries such as user input and external requests
- Vitest-based tests, including `@faasjs/pg-dev` for PostgreSQL workflows
- Vite Plus for development and build tooling
- plugins for business-specific extension points
- stable file conventions and examples that humans and AI coding agents can follow

Prefer this path for admin panels, back-office systems, internal tools, SaaS dashboards, BFF/API layers, and business workflow systems.

## React Is The Official Frontend Path

Use React for FaasJS frontend applications.

Do not add another frontend framework as an official equal path unless it clearly improves the curated React path. Alternative frontend stacks may be possible in user projects, but they should not drive core APIs, templates, or default docs.

## Ant Design Is The Business UI Path

Use `@faasjs/ant-design` for common business UI needs such as pages, routes, forms, tables, descriptions, loading states, and feedback.

Prefer FaasJS Ant Design wrappers before hand-writing glue code around raw Ant Design components when the wrapper covers the scenario. This keeps business UI code predictable and easier for agents to generate and review.

## PostgreSQL Is The Relational Data Path

Use PostgreSQL through `@faasjs/pg` for database-driven application work.

Prefer typed query builder patterns, explicit returning columns, concrete table declarations, timestamped migrations, and `@faasjs/pg-dev` tests. Avoid reshaping core design around database-neutral abstractions unless the change also improves the PostgreSQL path.

## Jobs Are The Background Work Path

Use `@faasjs/jobs` for asynchronous background work and scheduled enqueue workflows.

Prefer `.job.ts` files, `defineJob`, `enqueueJob`, dedicated worker processes, and a scheduler process for cron rules. Do not put background execution under HTTP server startup or plugin lifecycle unless the plugin is only injecting project context used by jobs.

## Typed APIs And Validation

Use `defineApi` for backend endpoints and keep request validation at system boundaries.

Prefer inline schemas close to the API handler, explicit params and response shapes, and tests that verify both runtime behavior and important type expectations. Do not hide API contracts behind implicit behavior or broad untyped helpers.

## Plugins Are Business Extension Points

Use plugins for project-specific cross-cutting concerns such as auth context, permissions, tenant context, request metadata, or service clients.

Plugins should make extension points explicit without turning FaasJS into a configuration-heavy framework. Keep business rules in app code or plugins rather than pushing them into core packages.

## Auth And Permissions

Do not treat auth or permissions as built-in FaasJS core features.

Production auth varies across password login, SSO, OAuth, sessions, JWTs, multi-tenancy, RBAC, ABAC, and product-specific policies. A starter or example may show a simple auth plugin pattern, but it should be understood as a demo for injecting current-user context and protecting APIs, not as a mandatory auth system.

## Replacement Paths

Teams may replace parts of the curated stack, but replacement paths are escape hatches rather than parallel first-class tracks.

When reviewing a proposal, do not add core complexity only to support an alternative UI library, database, validation strategy, or architecture style. Accept replacement-oriented changes only when they also make the curated main path clearer, safer, or easier to maintain.

## Agent-readable Application Work

FaasJS does not rely on Rails-style generators as its main productivity mechanism.

Instead, keep file structure, examples, tests, schemas, and typed contracts predictable enough that AI coding agents can create and modify complete application slices directly. Favor clear repeated code over clever abstractions when repetition makes review and generation safer.
