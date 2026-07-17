---
name: faasjs-best-practices
description: 'Use when working in any FaasJS repo and no narrower FaasJS skill is already selected, or when a task spans project conventions, validation gates, security boundaries, and multiple FaasJS subsystems. For focused work, also load the relevant FaasJS skill: faasjs-project-workflow, faasjs-react-ant-design, faasjs-api-jobs, faasjs-pg, faasjs-plugins-runtime, faasjs-utils-data, or faasjs-specs.'
---

# FaasJS Best Practices

## Default Workflow

1. Identify the task area and load the narrowest FaasJS skill that owns it.
2. Read local repo instructions and relevant `tsconfig.json` files before choosing imports or paths.
3. Keep changes minimal and task-scoped; avoid unrelated refactors, speculative fallbacks, and new aliases unless configuration changes with them.
4. Validate external input at boundaries, check auth/tenant/permission scope before data access, and never log secrets.
5. Before handoff, run `vp check --fix && vp test` when feasible; if not feasible, record why and run the smallest useful validation.

## Load These References

- New project, feature layout, config, CLI, comments, naming, or shared testing: use `faasjs-project-workflow`.
- React UI, `@faasjs/ant-design`, `useFaas`, forms, tables, drawers, CRUD screens, or React tests: use `faasjs-react-ant-design`.
- `.api.ts`, `defineApi`, HTTP plugin helpers, middleware, `.job.ts`, or `defineJob`: use `faasjs-api-jobs`.
- `@faasjs/pg`, `QueryBuilder`, table declarations, migrations, or PostgreSQL tests: use `faasjs-pg`.
- Plugin lifecycle, injected fields, logger usage, Node bootstrapping, or runtime config loading: use `faasjs-plugins-runtime`.
- `@faasjs/utils`, JSON, YAML, stream helpers, or validation helpers: use `faasjs-utils-data`.
- Normative runtime behavior for `faas.yaml`, routing, HTTP protocol, or plugin contracts: use `faasjs-specs`.

## Gotchas

- Zod is for external input contracts; keep internal `typeof`, `instanceof`, and null checks as control-flow predicates.
- Keep local TypeScript imports extensionless and prefer configured aliases over deep relative imports.
- Destructure React hook returns and only the top-level `defineApi`/`defineJob` handler context; keep business values visible as `params.key`.
- Return values directly unless an intermediate variable documents a non-trivial condition, is reused, or improves readability.

## Validation

- Use `vp check --fix` for formatting and linting.
- Use `vp test` or `vp test <pattern>` for tests.
- Run `npx faas types` after adding, moving, or removing `.api.ts` or `.job.ts` files.
- Run `npx faasjs-pg migrate` or targeted PG checks only when database changes require them and `DATABASE_URL` is available.
