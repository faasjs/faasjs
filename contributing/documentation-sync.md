# Documentation Sync

Use this guide after any FaasJS change that may require documentation updates or validation.

It covers syncing best-practices content under `skills/faasjs-best-practices/**`, specs under `skills/*/references/specs/**`, generated English docs under `docs/guidelines/**` and `docs/specs/**`, Chinese docs sourced from `skills/faasjs-best-practices/locales/zh/**` and generated under `docs/zh/guidelines/**` and `docs/zh/specs/**`, generated API docs from `packages/*/src`, and docs navigation files such as `docs/guide/README.md`, `docs/zh/guide/README.md`, and `docs/site/site.config.ts`.

## Overview

Use this guide after any FaasJS code or behavior change to decide which docs must be updated in the same change.

Keep source-of-truth docs, generated published docs, translations, generated API docs, and docs site navigation aligned before handoff.

Also check whether `CHANGELOG.md` needs an update for the same change, especially when behavior, APIs, workflows, or user-visible guidance changed.

## Quick Triage

Treat the change as doc-affecting if it touches:

- public APIs, exported types, or JSDoc in `packages/*/src`
- framework behavior, runtime semantics, request or response behavior, plugin behavior, or configuration behavior
- file conventions, recommended usage patterns, project scaffolding, or developer workflow
- `packages/create-faas-app/**`, `examples/**`, `images/**`, or commands shown to users
- docs routes, page moves, new pages, deleted pages, or sidebar grouping changes

If you are unsure, assume docs are affected and follow the workflow below before finishing the change.

## Workflow

1. Classify the change.
   - API or JSDoc change
   - best-practices or spec change
   - docs navigation or information-architecture change
   - example, scaffolding, Docker, or workflow change
2. Update the source of truth first.
   - API docs start from JSDoc in `packages/*/src`
   - best practices start from `skills/faasjs-best-practices/**`
   - specs start from `skills/*/references/specs/**`
3. Generate the published docs.
   - English: generated from `skills/faasjs-best-practices/guidelines/**` and `skills/*/references/specs/**` into `docs/guidelines/**` and `docs/specs/**` by `@faasjs/docgen`
   - Chinese: generated from `skills/faasjs-best-practices/locales/zh/**` into `docs/zh/guidelines/**` and `docs/zh/specs/**` by `@faasjs/docgen`
   - indexes and navigation: `docs/guide/README.md`, `docs/zh/guide/README.md`, `docs/site/site.config.ts`
4. Update release notes when needed.
   - review user-visible behavior, API, workflow, and documentation changes since the previous released version, not just the current diff you are editing
   - use the release boundary from the latest released changelog entry or git tag (for example `previous-version..HEAD`) to inspect the full set of commits/files that belong in the next entry
   - turn that full change set into user-facing notes by keeping only items that matter to end users, and skip internal-only churn
   - add or adjust the unreleased entry when the change should be called out to users
5. Regenerate generated outputs only from their real source.
   - run `vp run doc` when exported APIs or JSDoc changed
   - never edit Markdown under `packages/*/{classes,functions,interfaces,type-aliases,variables}` directly
   - update JSDoc in `packages/*/src` first, then run `vp run doc` to refresh generated package API Markdown
   - do not hand-edit `docs/dist/**`
6. Validate the smallest meaningful scope.
   - API docs only: `vp run doc`
   - docs content or navigation: `cd docs && npm run build`
   - cross-cutting changes: run both

## Working Rules

- Update English source docs and Chinese locale source docs together for the same best-practices or spec change unless the user explicitly scopes otherwise.
- Do not update copied or generated docs while leaving the source-of-truth files stale.
- Do not directly edit generated Markdown under `packages/**`, `docs/guidelines/**`, `docs/specs/**`, `docs/zh/guidelines/**`, or `docs/zh/specs/**`; change the source JSDoc or `skills/**` content and regenerate with `vp run doc`.
- Do not ship a user-visible change without checking whether `CHANGELOG.md` should mention it.
- Do not regenerate `CHANGELOG.md` from only the files in your current patch; review the whole range since the previous released version and summarize only end-user-meaningful items.
- When a change does not require docs edits, say why in the final handoff.
