# FaasJS Documentation Sync Rules

Use this reference when a FaasJS change may require docs updates and you need the detailed path map or checklist.

## What Counts As A Doc-Affecting Change

Update docs when a change affects any of the following:

- public APIs, exported types, or JSDoc in `packages/*/src`
- framework behavior, runtime semantics, request or response behavior, plugin behavior, or configuration behavior
- file conventions, recommended usage patterns, project scaffolding, or developer workflow
- examples, starter templates, or commands shown to users
- docs site navigation, guide structure, or published page locations
- Docker image behavior or deployment guidance under `images/**`

If a user-facing behavior changes and a reader could reasonably learn that behavior from docs, treat it as a doc change.

## Source Of Truth By Doc Type

### Public API Reference

Source of truth:

- JSDoc in `packages/*/src`

Generated outputs:

- `packages/*/{classes,functions,interfaces,type-aliases,variables}`
- `docs/doc/**` after the docs site build copies package docs

Workflow:

1. Edit JSDoc next to the exported declaration in `packages/*/src`.
2. Run `vp run doc` or `npx vp run doc`.
3. Review the generated package Markdown.
4. Rebuild the docs site if needed.

Do not hand-edit generated API Markdown unless the task is explicitly about generated output maintenance and the same change also updates the true source.

### Best-Practices Guides And Specs

Source of truth:

- `skills/faasjs-best-practices/**`
- `skills/*/references/specs/**`

Published docs:

- English guide index: `docs/guide/README.md`
- English guides: `docs/guidelines/**`
- English specs: `docs/specs/**`
- Chinese guide index: `docs/zh/guide/README.md`
- Chinese guides: `docs/zh/guidelines/**`
- Chinese specs: `docs/zh/specs/**`

Workflow:

1. Update the relevant files under `skills/faasjs-best-practices/**` or `skills/*/references/specs/**`.
2. Update the matching published English docs under `docs/guidelines/**` or `docs/specs/**`.
3. Update the matching Chinese docs under `docs/zh/guidelines/**` or `docs/zh/specs/**`.
4. If the change affects discoverability or section layout, update `docs/guide/README.md`, `docs/zh/guide/README.md`, and `docs/site/site.config.ts`.

Do not ship a behavior change that updates the skill guidance while leaving the published docs stale.

### Docs Site Navigation And Landing Pages

Source files:

- `docs/guide/README.md`
- `docs/zh/guide/README.md`
- `docs/site/site.config.ts`

Update these when:

- adding, removing, renaming, or moving published guide pages
- changing the intended information architecture
- changing sidebar grouping or top-level learn navigation

### Examples, Templates, And User Workflow Docs

Update docs when code changes affect:

- `packages/create-faas-app/**`
- `examples/**`
- commands shown in root or docs markdown
- setup, build, or deployment behavior

Common files to review:

- `README.md`
- `docs/guide/README.md`
- `docs/zh/guide/README.md`
- any relevant guide or spec page

### Docker And Deployment Docs

When changing Docker images or deployment-related behavior, update:

- `images/**`
- matching docs pages or README references that explain those images

## Required Sync Checklist

When code changes land, verify all relevant boxes:

- [ ] public API behavior is documented in source JSDoc when needed
- [ ] generated API docs were refreshed with `vp run doc` when exported APIs or JSDoc changed
- [ ] matching best-practices skills were updated when recommended usage changed
- [ ] matching published English docs under `docs/guidelines/**` or `docs/specs/**` were updated
- [ ] matching published Chinese docs under `docs/zh/guidelines/**` or `docs/zh/specs/**` were updated
- [ ] guide indexes and sidebar config were updated if routes or page layout changed
- [ ] examples, starter docs, or Docker docs were updated when user workflows changed
- [ ] generated outputs such as `docs/dist/**` were not hand-edited

## Recommended Workflow Per Change

1. Classify the code change.
   - API change
   - behavior change
   - convention change
   - docs-only change
2. Map the affected docs using the sections above.
3. Update source-of-truth docs first.
4. Update published docs and translations in the same change.
5. Regenerate generated docs when required.
6. Run the smallest meaningful validation.

## Validation

Use the smallest useful checks for the docs you touched:

- API docs changed: `vp run doc`
- docs site content or navigation changed: `cd docs && npm run build`
- major cross-cutting changes: run both

If `vp` is unavailable, use `npx vp ...`.

## Handoff Notes

When handing off a change, call out:

- which code areas changed
- which docs were updated
- whether `vp run doc` was run
- whether `cd docs && npm run build` was run
- any intentionally deferred translation or docs follow-up
