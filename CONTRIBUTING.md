# Contributing to FaasJS

This file is the entry point for contributors and agents developing the FaasJS framework in this monorepo.

If the user is building with FaasJS instead of modifying the framework, read [`skills/faasjs-best-practices/SKILL.md`](./skills/faasjs-best-practices/SKILL.md) instead.

## Read In Order

1. [`contributing/target-users.md`](./contributing/target-users.md) for product boundaries, target users, supported stacks, and core framework trade-offs
2. [`contributing/source-of-truth.md`](./contributing/source-of-truth.md) for edit locations, generated-file rules, and codebase conventions
3. [`contributing/validation.md`](./contributing/validation.md) for environment requirements and validation commands
4. [`contributing/documentation-sync.md`](./contributing/documentation-sync.md) when changes may affect docs, generated docs, translations, navigation, or changelog entries; it uses `@faasjs/docgen` via `vp run doc` as the docs update and sync tool

## By Task

- Product positioning, supported-stack, dependency-policy, or framework-abstraction changes: also follow [`contributing/target-users.md`](./contributing/target-users.md)
- Framework code, templates, images, or contribution-guide changes: follow [`contributing/source-of-truth.md`](./contributing/source-of-truth.md) and [`contributing/validation.md`](./contributing/validation.md)
- Public API, JSDoc, docs, docs navigation, generated docs, or user-facing workflow changes: also follow [`contributing/documentation-sync.md`](./contributing/documentation-sync.md) and regenerate derived docs with `vp run doc`
- Security reports: follow [`SECURITY.md`](./SECURITY.md)

## Documentation Flow

- Edit source-of-truth content first: JSDoc in `packages/*/src`, English guides in `skills/faasjs-best-practices/guidelines/**`, specs in `skills/*/references/specs/**`, and Chinese translations in `skills/faasjs-best-practices/locales/zh/**`.
- Run `vp run doc` to invoke `@faasjs/docgen`, which refreshes API Markdown, skill references, generated published docs, and generated guide indexes.
- Do not hand-edit generated docs under `packages/*/{classes,functions,interfaces,type-aliases,variables}`, `docs/guidelines/**`, `docs/specs/**`, `docs/zh/guidelines/**`, `docs/zh/specs/**`, `docs/guide/README.md`, or `docs/zh/guide/README.md`.

## Standard Flow

1. Check existing discussions and issues before creating a new one.
2. Create or confirm the issue with the proper template (`Bug` or `Feature`).
3. Create a branch from `main`.
4. Open a PR that links the issue (`Closes #123`).
5. Wait for CI and review, then merge with **squash**.

## Core Expectations

- Keep each issue and PR focused on one problem or feature.
- Use lowercase branch names with hyphens: `feat/<name>`, `fix/<name>`, `docs/<name>`, `chore/<name>`.
- Mention affected packages under `packages/*`.
- Call out breaking changes explicitly.
- Use [Conventional Commits](https://www.conventionalcommits.org/).

## Review And Merge

- `main` only accepts PR merges.
- At least 1 approval is required.
- Required checks must pass.
- Resolve all review conversations before merge.
- Merge strategy: **Squash and merge**.

## Release

Releases are handled by maintainers.
Do not run release scripts in contributor PRs unless explicitly requested.

## Other Ways To Help

- Star or Watch [faasjs/faasjs](https://github.com/faasjs/faasjs)
- Share your FaasJS experience with articles or videos
- Improve docs at [faasjs.com](https://faasjs.com)
- [Sponsor FaasJS](https://github.com/sponsors/faasjs)
