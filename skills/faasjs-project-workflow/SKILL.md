---
name: faasjs-project-workflow
description: 'Use when creating, configuring, reviewing, or onboarding a FaasJS project; working with create-faas-app, vp CLI, TypeScript or Vite config, feature folders, file and naming conventions, test placement, JSDoc/comments, or complete application slice workflow.'
---

# FaasJS Project Workflow

## Default Workflow

1. Read the project config and file layout before adding or moving files.
2. Keep features as vertical slices with UI, API, database changes, and tests close together.
3. Follow existing `tsconfig.json` aliases and Vite/Vitest configuration; do not invent new aliases without matching runtime config.
4. Place tests in `__tests__/` inside the feature or package area they protect.
5. Use public JSDoc only for package entrypoints or shared exports with non-obvious caller contracts.

## Load These References

- New project setup or onboarding: `references/guidelines/getting-started.md`.
- Supported stack and framework boundaries: `references/guidelines/curated-stack.md`.
- Complete vertical feature layout: `references/guidelines/application-slices.md`.
- File placement and extraction rules: `references/guidelines/file-conventions.md`.
- TypeScript, Vite, and shared tooling config: `references/guidelines/project-config.md`.
- CLI commands, type generation, migrations, test commands, and environment variables: `references/guidelines/cli-and-tooling.md`.
- Identifier, file, and directory names: `references/guidelines/naming-convention.md`.
- JSDoc and inline comment policy: `references/guidelines/code-comments.md`.
- Shared test-level and mock-boundary rules: `references/guidelines/testing.md`.

## Gotchas

- Tests, fixtures, and mocks belong under the relevant `__tests__/` directory, not as siblings.
- Extract components, hooks, helpers, or abstractions only for reuse, real boundaries, or large bodies.
- Do not add comments to untouched code; delete confirmed-dead code instead of leaving markers.
- Regenerate derived docs from source rather than editing generated docs directly.

## Validation

- Run `vp check --fix` after code or docs source edits when feasible.
- Run `vp test` or a focused `vp test <pattern>` for behavior changes.
- Run `npm run doc` when guides, source docs, API JSDoc, or docs navigation are affected.
