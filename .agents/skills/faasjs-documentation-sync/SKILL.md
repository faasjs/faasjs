---
name: faasjs-documentation-sync
description: Use when a change in the FaasJS repo may require documentation updates or validation. This covers syncing best-practices content under `skills/faasjs-best-practices/**`, specs under `skills/*/references/specs/**`, published docs under `docs/guidelines/**` and `docs/specs/**`, Chinese docs under `docs/zh/guidelines/**` and `docs/zh/specs/**`, generated API docs from `packages/*/src`, and docs navigation files such as `docs/guide/README.md`, `docs/zh/guide/README.md`, and `docs/site/site.config.ts`.
---

# FaasJS Documentation Sync

## Overview

Use this skill after any FaasJS code or behavior change to decide which docs must be updated in the same change.

Keep source-of-truth docs, published docs, translations, generated API docs, and docs site navigation aligned before handoff.

## Quick Triage

Treat the change as doc-affecting if it touches:

- public APIs, exported types, or JSDoc in `packages/*/src`
- framework behavior, runtime semantics, request or response behavior, plugin behavior, or configuration behavior
- file conventions, recommended usage patterns, project scaffolding, or developer workflow
- `packages/create-faas-app/**`, `examples/**`, `images/**`, or commands shown to users
- docs routes, page moves, new pages, deleted pages, or sidebar grouping changes

If you are unsure, assume docs are affected and read `references/sync-rules.md` before finishing the task.

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
3. Sync the published docs.
   - English: `docs/guidelines/**`, `docs/specs/**`
   - Chinese: `docs/zh/guidelines/**`, `docs/zh/specs/**`
   - indexes and navigation: `docs/guide/README.md`, `docs/zh/guide/README.md`, `docs/site/site.config.ts`
4. Regenerate generated outputs only from their real source.
   - run `vp run doc` when exported APIs or JSDoc changed
   - do not hand-edit generated package API markdown or `docs/dist/**`
5. Validate the smallest meaningful scope.
   - API docs only: `vp run doc`
   - docs content or navigation: `cd docs && npm run build`
   - cross-cutting changes: run both

## Working Rules

- Update English and Chinese published docs together for the same best-practices or spec change unless the user explicitly scopes otherwise.
- Do not update copied or generated docs while leaving the source-of-truth files stale.
- When a change does not require docs edits, say why in the final handoff.

## Reference

For the full path map, checklist, and handoff expectations, read `references/sync-rules.md`.
