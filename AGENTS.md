# Agent Guide

## Repo Snapshot

FaasJS is a TypeScript monorepo built with npm workspaces and [vite plus](https://viteplus.dev/).

- `packages/core`: core runtime, server utilities, HTTP helpers
- `packages/dev`: dev tooling, CLI helpers, test support
- `packages/node-utils`: Node-specific utilities and hooks
- `packages/react`: React bindings
- `packages/ant-design`: Ant Design integration
- `packages/types`: shared types and base TS config
- `packages/create-faas-app`: project scaffolding CLI
- `docs`: documentation site
- `skills`: user-facing agent skills, workflow guides, best-practices guides, and bundled framework specifications/references
- `images`: Docker image definitions and related assets/configs
- `templates/*`: runnable templates and smoke-test references
- `benchmarks`: benchmark suite

Most package source code lives in `packages/*/src`, and package entrypoints are defined in each package's `package.json`.

## Environment

- Node `>=24.0.0`
- npm `>=11.0.0`
- `package-lock.json` is the canonical lockfile
- `vp` from `vite-plus`; if `vp` is not available on your PATH locally, use `npx vp ...`

## Source Of Truth

- Edit source files under `packages/*/src`, `templates/*/src`, or `docs/**`
- Edit skill definitions and supporting guides under `skills/**`
- Content under `skills/**` is user-facing guidance, skills, or reference material for people building with FaasJS; it is not the internal maintainer guide for developing the FaasJS framework itself
- Keep repo-specific maintainer workflows, release steps, and validation requirements in `AGENTS.md` or repo-local agent skills under `.agents/skills/**`, not in user-facing `skills/**`
- `skills/faasjs-best-practices/**` is the source of truth for public best-practices guidance
- When framework behavior, public APIs, file conventions, recommended usage, docs navigation, or public workflows change, follow the repo-local documentation sync workflow at [`.agents/skills/faasjs-documentation-sync/SKILL.md`](./.agents/skills/faasjs-documentation-sync/SKILL.md)
- Edit framework specifications under `skills/*/references/specs/**`
- Edit Docker image definitions and related docs/configs under `images/**`
- Do not hand-edit `dist/**`; those directories are generated artifacts
- Do not directly edit generated API Markdown under `packages/*/{classes,functions,interfaces,type-aliases,variables}`; update JSDoc in `packages/*/src` and use the documentation sync workflow to regenerate and validate derived docs instead
- Keep changes scoped to the affected package(s); avoid unrelated formatting churn

## Style And Conventions

The root [`vite.config.ts`](./vite.config.ts) is the source of truth for formatting, linting, packing, and test config.

- TypeScript + ESM throughout the repo
- Single quotes, no semicolons, sorted imports
- Prefer `import type` where appropriate
- Type-aware linting is enabled
- Root TS path aliases map `@faasjs/*` to `packages/*/src`

## Validation

Prefer the smallest useful validation for the files you touched, then run broader checks before final handoff when the change is significant.

- Install dependencies: `vp install`
- Run tests: `vp test`
- Run coverage suite: `vp run ci`
- Run lint/format/static checks: `vp check`
- Build packages: `vp pack`
- Regenerate API docs: `vp run doc`
- Build docs site: `cd docs && vp install && vp run build`

CI currently runs the equivalent of:

```bash
vp install
vp pack
vp check
vp run ci
```

If `vp` is not on PATH locally, use `npx vp ...` instead.

## Testing Notes

- Node tests are primarily `packages/**/*.test.ts` and `packages/**/*.test.tsx`
- Tests that require `jsdom` must use `packages/**/*.ui.test.ts` or `packages/**/*.ui.test.tsx`
- Type tests use `packages/**/*.types.test.ts` and `packages/**/*.types.test.tsx`
- Templates also have local test scripts and are useful for targeted regression checks

## Docs And Generated Files

- `vp run doc` runs [`build-docs.ts`](./build-docs.ts) and refreshes the tracked API Markdown under each package
- The docs site build lives in [`docs/package.json`](./docs/package.json)
- For source-of-truth paths, translation sync, generated-doc rules, docs validation, and changelog triage, use the repo-local skill at [`.agents/skills/faasjs-documentation-sync/SKILL.md`](./.agents/skills/faasjs-documentation-sync/SKILL.md)
- Root `.gitignore` ignores local artifacts such as `dist`, `coverage`, `tmp`, logs, and generated report files

## Collaboration Expectations

- Follow the existing contribution flow in [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Keep PRs small and focused
- Mention affected packages clearly
- Link PRs to issues with `Closes #...`
- Use Conventional Commits
- `main` is merged through squash PRs
