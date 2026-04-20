# Agent Guide

This file routes agents to the right guide before making changes in this repo.

## Choose Your Path

- If the user is building with FaasJS, using FaasJS APIs, following FaasJS app structure, or asking for FaasJS best practices, read [`skills/faasjs-best-practices/SKILL.md`](./skills/faasjs-best-practices/SKILL.md) first.
- If the user is developing or maintaining the FaasJS framework in this monorepo, read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first.
- If a framework change may affect docs, generated docs, translations, navigation, or changelog entries, also read [`contributing/documentation-sync.md`](./contributing/documentation-sync.md).

## Guide Boundaries

- `skills/**` is the source of truth for public guidance aimed at people building with FaasJS.
- `contributing/**` is the source of truth for framework contribution workflows and maintainer-facing rules.
- Public framework specifications live under `skills/*/references/specs/**`.

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
- `skills`: user-facing agent skills, workflow guides, best-practices guides, and bundled framework specifications and references
- `contributing`: framework contribution guides and maintainer-facing workflows
- `images`: Docker image definitions and related assets and configs
- `templates/*`: runnable templates and smoke-test references
- `benchmarks`: benchmark suite

Most package source code lives in `packages/*/src`, and package entrypoints are defined in each package's `package.json`.
