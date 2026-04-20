# API-First Terminology Refactor

Status: phases 1-4 complete, remaining phases pending
Owner: maintainers / framework contributors
Scope: next major release

## Summary

This refactor moves FaasJS application-facing terminology from `func` to `api`
without renaming the low-level runtime primitive `Func`.

The end state should feel consistent to app authors:

- API files end with `.api.ts`
- API examples use `export default defineApi(...)`
- user-facing helper names prefer `api` over `func`

The low-level runtime surface stays intentionally stable:

- keep `Func`
- keep `FuncConfig`
- keep `FuncPluginConfig`
- keep `loadPlugins`
- keep plugin lifecycle terminology

This is a major-breaking refactor. Do not merge it as a partial rename.

## Progress Log

- 2026-04-20: completed Phase 1 in `packages/core`
  - route lookup now resolves `.api.ts`, `index.api.ts`, and `default.api.ts`
  - server loader now prefers default exports and still falls back to legacy `{ func }`
  - added `parseApiFilenameFromStack()` and kept `parseFuncFilenameFromStack()` as a deprecated alias
  - refreshed generated API docs with `npx vp run doc`
  - validated with `npx vp test run packages/core/src/server/__tests__ packages/core/src/__tests__/parseFuncFilenameFromStack.test.ts packages/core/src/func/__tests__/coverage.test.ts`
- 2026-04-21: completed Phase 2 in `packages/dev` and added the Phase 3 type-surface prerequisite
  - typegen now scans `.api.ts` files, emits `InferFaasApi`, and exposes `isTypegenInputFile()`
  - kept `isTypegenSourceFile()` as a deprecated alias during migration
  - Vite dev integration now anchors config discovery at `index.api.ts` and watches `.api.ts` inputs
  - added `InferFaasApi<TModule>` in `packages/types` with default-export-first inference while keeping `InferFaasFunc<TModule>` as a deprecated alias
  - refreshed generated API docs with `npx vp run doc`
  - validated with `npx vp test run packages/dev/src/typegen/__tests__/typegen.test.ts packages/dev/src/vite/__tests__/vite.test.ts packages/dev/src/vite/__tests__/vite-typegen.test.ts packages/dev/src/shared/__tests__/server_config.test.ts packages/dev/src/cli/__tests__/index.test.ts packages/dev/src/__tests__/index.test.ts packages/types/src/__tests__/index.test.ts`
- 2026-04-21: completed Phase 3 in `packages/node-utils` and `packages/types`
  - added `loadApiHandler()` and kept `loadFunc()` as a deprecated alias
  - updated node-utils examples and helper docs to use `.api.ts` wording and `['default', 'func']` loader preference
  - exported `loadApiHandler` ahead of `loadFunc` from the package root while keeping legacy compatibility
  - refreshed generated API docs with `npx vp run doc`
  - validated with `npx vp test run packages/node-utils/src/__tests__/load_func.test.ts packages/node-utils/src/__tests__/load_package.test.ts packages/node-utils/src/__tests__/load_config.test.ts packages/node-utils/src/__tests__/load_plugins.test.ts packages/node-utils/src/__tests__/index.test.ts`
- 2026-04-21: completed Phase 4 in `packages/dev`
  - renamed the public test helper to `ApiTester` and kept `FuncWarper` as a deprecated alias
  - switched test-helper path inference to `.api.ts` and updated public JSDoc/examples to prefer default-exported API modules
  - renamed dev testing fixtures from `.func.ts` to `.api.ts` and updated tests to import default exports
  - refreshed generated API docs with `npx vp run doc`
  - validated with `npx vp test run packages/dev/src/testing/__tests__ packages/dev/src/__tests__/index.test.ts`

## Goals

- make the public FaasJS authoring path read as API-first
- remove `.func.ts` from templates, docs, and generated examples
- reduce `func` as a user-facing term outside the low-level runtime
- make `defineApi()` + default export the canonical application pattern
- keep runtime terminology precise instead of renaming everything to `api`

## Non-Goals

- do not rename the `Func` class to `Api`
- do not rename `FuncConfig` or `FuncPluginConfig`
- do not rename `loadPlugins`
- do not introduce a new named export convention such as `export const api = ...`
- do not support both `.func.ts` and `.api.ts` as a long-term routing mode
- do not broaden framework semantics beyond API entry files

## Fixed Decisions

- API entry files switch from `.func.ts` to `.api.ts`
- application docs and templates switch from `export const func = defineApi(...)`
  to `export default defineApi(...)`
- runtime loaders and type inference may support legacy named `func` during the
  migration window, but docs and scaffolding must not generate it
- do not add a named `api` export convention
- deprecated symbol aliases are acceptable for one release cycle after the major
  cutover; file suffixes do not get the same dual-support period
- `InferFaasAction` stays as-is
- `FuncEventType` and `FuncReturnType` stay as-is for this refactor because they
  describe the low-level `Func` primitive directly

## Current Baseline

Snapshot taken while drafting this plan:

- `*.func.ts` files in repo: 56
- `*.api.ts` files in repo: 0
- `loadFunc` references: 51
- `FuncWarper` references: 91
- `InferFaasFunc` references: 21

Use this only as a planning baseline. Re-run the search commands before
implementation starts.

## Rename Matrix

| Area                        | Current                          | Target                      | Decision             |
| --------------------------- | -------------------------------- | --------------------------- | -------------------- |
| API file suffix             | `.func.ts`                       | `.api.ts`                   | hard break           |
| API module export           | `export const func = ...`        | `export default ...`        | canonical            |
| Node helper                 | `loadFunc`                       | `loadApiHandler`            | add deprecated alias |
| Stack helper                | `parseFuncFilenameFromStack`     | `parseApiFilenameFromStack` | add deprecated alias |
| Type inference              | `InferFaasFunc`                  | `InferFaasApi`              | add deprecated alias |
| Test helper class           | `FuncWarper`                     | `ApiTester`                 | add deprecated alias |
| Typegen watcher helper      | `isTypegenSourceFile`            | `isTypegenInputFile`        | add deprecated alias |
| Low-level runtime primitive | `Func`                           | `Func`                      | keep                 |
| Runtime config types        | `FuncConfig`, `FuncPluginConfig` | unchanged                   | keep                 |
| Action inference            | `InferFaasAction`                | unchanged                   | keep                 |

## Implementation Principles

- Change source-of-truth docs before copied or published docs.
- Do not hand-edit generated API docs. Update source JSDoc and run `vp run doc`.
- Do not leave templates or tests teaching the old convention after merge.
- Prefer default export in examples and generators. Do not add `export const api`.
- Keep runtime naming accurate: use `api` for app-facing file/module concepts and
  keep `Func` for the low-level executable unit.
- Land this work in a major-release branch or as a tightly coordinated major PR.

## Phase Checklist

### Phase 0 - Freeze The Contract

- [ ] Confirm the release target is a major version.
- [ ] Confirm the canonical authoring pattern is `export default defineApi(...)`.
- [ ] Confirm named `api` exports are out of scope.
- [ ] Confirm file suffix migration is one-way: final merged state must not route
      both `.func.ts` and `.api.ts`.
- [ ] Confirm deprecated symbol aliases will remain for one release cycle, then
      be removed in the following major.
- [ ] Confirm `FuncEventType` and `FuncReturnType` remain unchanged in this pass.

### Phase 1 - Runtime Routing And Core Helpers

Primary files:

- `packages/core/src/server/routes.ts`
- `packages/core/src/server/index.ts`
- `packages/core/src/func/index.ts`

Checklist:

- [x] Update route lookup from `.func.ts` to `.api.ts`.
- [x] Update fallback lookup order to:
  1. `<p>.api.ts`
  2. `<p>/index.api.ts`
  3. `<p>/default.api.ts`
  4. parent fallback chain using `default.api.ts`
- [x] Update any user-facing route errors from "function file" to "API file".
- [x] Add `parseApiFilenameFromStack()` and make it detect `.api.ts`.
- [x] Keep `parseFuncFilenameFromStack()` as a deprecated alias that forwards to
      `parseApiFilenameFromStack()` during the migration window.
- [x] Update the `Func` constructor to use the new parser internally.
- [x] Update JSDoc examples and comments that still say `.func.ts`.
- [x] Update server loader export preference to default export first.
- [x] Keep legacy named `func` support temporarily in runtime loaders; do not add
      named `api` support.

Tests to update in this phase:

- [x] `packages/core/src/server/__tests__/**`
- [x] `packages/core/src/__tests__/parseFuncFilenameFromStack.test.ts`
- [x] `packages/core/src/func/__tests__/coverage.test.ts`
- [x] any fixtures under `packages/core/src/server/__tests__/**` that use
      `.func.ts` names

### Phase 2 - Typegen, Vite, And Dev Runtime Integration

Primary files:

- `packages/dev/src/typegen/index.ts`
- `packages/dev/src/vite/server.ts`
- `packages/dev/src/shared/server_config.ts`
- `packages/dev/src/index.ts`

Checklist:

- [x] Rename internal typegen file scanning from `readFuncFiles()` to
      `readApiFiles()`.
- [x] Change typegen scanning from `.func.ts` to `.api.ts`.
- [x] Rename `isTypegenSourceFile()` to `isTypegenInputFile()`.
- [x] Keep `isTypegenSourceFile()` as a deprecated alias during migration.
- [x] Switch generated route imports from `InferFaasFunc` to `InferFaasApi`.
- [x] Update route normalization logic from `.func` endings to `.api` endings.
- [x] Update Vite watcher logic to restart on `.api.ts` changes.
- [x] Update any example or comment that still references `.func.ts`.
- [x] Update the default source anchor in server config helpers from
      `index.func.ts` to `index.api.ts`.

Tests to update in this phase:

- [x] `packages/dev/src/typegen/__tests__/typegen.test.ts`
- [x] `packages/dev/src/vite/__tests__/vite.test.ts`
- [x] `packages/dev/src/vite/__tests__/vite-typegen.test.ts`
- [x] `packages/dev/src/shared/__tests__/server_config.test.ts`
- [x] `packages/dev/src/cli/__tests__/index.test.ts`

### Phase 3 - Node Utils, Type Surface, And Public Helper Names

Primary files:

- `packages/node-utils/src/load_func.ts`
- `packages/node-utils/src/index.ts`
- `packages/node-utils/src/load_package.ts`
- `packages/node-utils/src/load_config.ts`
- `packages/node-utils/src/load_plugins.ts`
- `packages/types/src/index.ts`

Checklist:

- [x] Add a new public helper named `loadApiHandler()`.
- [x] Keep `loadFunc()` as a deprecated alias that forwards to `loadApiHandler()`
      for one release cycle.
- [x] Update `loadApiHandler()` docs and examples to reference `.api.ts`.
- [x] Update package root exports to expose the new name first.
- [x] Add `InferFaasApi<TModule>` in `packages/types/src/index.ts`.
- [x] Keep `InferFaasFunc<TModule>` as a deprecated alias during migration.
- [x] Make `InferFaasApi` prefer `default` export first, then fall back to legacy
      `{ func }`.
- [x] Do not add `{ api }` inference support.
- [x] Update `loadPackage()` examples that currently show `['func', 'default']`
      to prefer `['default', 'func']` during migration and `['default']` after alias
      removal.
- [x] Update helper docs that say "function file" when the text is application-
      facing; keep low-level `Func` wording when the API really is about `Func`.

Tests to update in this phase:

- [x] `packages/node-utils/src/__tests__/load_func.test.ts`
- [x] `packages/node-utils/src/__tests__/load_package.test.ts`
- [x] `packages/node-utils/src/__tests__/load_config.test.ts`
- [x] `packages/node-utils/src/__tests__/load_plugins.test.ts`
- [x] `packages/node-utils/src/__tests__/index.test.ts`

### Phase 4 - Test Helpers And Dev Ergonomics

Primary files:

- `packages/dev/src/testing/func_warper.ts`
- `packages/dev/src/testing/index.ts`
- `packages/dev/src/index.ts`

Checklist:

- [x] Rename the public wrapper class from `FuncWarper` to `ApiTester`.
- [x] Keep `FuncWarper` as a deprecated alias during migration.
- [x] Keep `test()` as the convenience helper name.
- [x] Update path inference inside the tester to look for `.api.ts`.
- [x] Update examples to import default exports instead of named `func`.
- [x] Update JSDoc to talk about wrapped APIs where appropriate while keeping
      `Func` references only where the low-level type matters.

Tests to update in this phase:

- [x] `packages/dev/src/testing/__tests__/basic.test.ts`
- [x] `packages/dev/src/testing/__tests__/encoding.test.ts`
- [x] `packages/dev/src/testing/__tests__/http.test.ts`
- [x] `packages/dev/src/testing/__tests__/initByFunc.test.ts`
- [x] `packages/dev/src/testing/__tests__/use.test.ts`
- [x] any fixtures under `packages/dev/src/testing/fixtures/**`

### Phase 5 - Templates, Scaffolding, Benchmarks, And Fixtures

Primary files and directories:

- `packages/create-faas-app/src/action.ts`
- `packages/create-faas-app/src/__tests__/action.test.ts`
- `packages/create-faas-app/template/**`
- `templates/**`
- `benchmarks/**`

Checklist:

- [ ] Rename scaffolded API files from `.func.ts` to `.api.ts`.
- [ ] Switch scaffolded API modules to `export default defineApi(...)`.
- [ ] Update `create-faas-app` expectations and snapshot-style tests.
- [ ] Update template READMEs to explain `.api.ts`.
- [ ] Update routing fallback examples to `index.api.ts` and `default.api.ts`.
- [ ] Rename benchmark fixtures that currently use `.func.ts`.
- [ ] Update any hard-coded generated-path assertions to `.api.ts`.
- [ ] Keep internal fixture directory names such as `funcs/` unchanged unless they
      actively confuse the implementation. File suffixes are the priority.

Minimum file groups to review:

- [ ] `packages/create-faas-app/template/basic/**`
- [ ] `packages/create-faas-app/template/antd/**`
- [ ] `templates/hello-api/**`
- [ ] `templates/params-and-errors/**`
- [ ] `templates/routing-fallback/**`
- [ ] `benchmarks/server/raw/**`

### Phase 6 - Source-Of-Truth Docs, Published Docs, And Navigation

Follow `contributing/documentation-sync.md`.

Source-of-truth docs to update first:

- [ ] `skills/faasjs-best-practices/SKILL.md`
- [ ] `skills/faasjs-best-practices/guidelines/file-conventions.md`
- [ ] `skills/faasjs-best-practices/guidelines/define-api.md`
- [ ] `skills/faasjs-best-practices/guidelines/node-utils.md`
- [ ] `skills/faasjs-best-practices/guidelines/ant-design.md`
- [ ] `skills/faasjs-best-practices/references/specs/routing-mapping.md`
- [ ] `skills/faasjs-best-practices/references/specs/faas-yaml.md`
- [ ] `skills/faasjs-best-practices/references/specs/plugin.md`

Published docs to sync after source-of-truth updates:

- [ ] `docs/guidelines/**`
- [ ] `docs/specs/**`
- [ ] `docs/zh/guidelines/**`
- [ ] `docs/zh/specs/**`
- [ ] `docs/README.md`
- [ ] `docs/zh/README.md`
- [ ] `docs/guide/README.md`
- [ ] `docs/zh/guide/README.md`
- [ ] `docs/site/site.config.ts` if navigation labels or routes change

Documentation content changes required:

- [ ] replace `.func.ts` examples with `.api.ts`
- [ ] replace `export const func = defineApi(...)` examples with default export
- [ ] replace `loadFunc()` guidance with `loadApiHandler()`
- [ ] replace `FuncWarper` guidance with `ApiTester`
- [ ] replace `InferFaasFunc` examples with `InferFaasApi`
- [ ] keep low-level `Func` examples only where the docs are intentionally about
      low-level runtime composition
- [ ] update English and Chinese docs in the same change

### Phase 7 - Generated Outputs, Changelog, And Validation

Generated and derived outputs:

- [ ] run `vp run doc` after JSDoc and public API changes
- [ ] do not hand-edit generated API docs
- [ ] review generated diffs under checked-in API doc outputs before merge

Release notes:

- [ ] add a major-breaking changelog entry in `CHANGELOG.md`
- [ ] call out the required file rename from `.func.ts` to `.api.ts`
- [ ] call out the move to default export examples
- [ ] call out deprecated aliases and their removal timeline

Validation:

- [ ] run `vp check`
- [ ] run `vp test`
- [ ] run `vp run doc`
- [ ] run `cd docs && vp install && vp run build`
- [ ] for a wide refactor branch, run `vp run ci` before merge

## Deprecated Alias Plan

Allowed temporary aliases after the major cutover:

- `loadFunc` -> `loadApiHandler`
- `parseFuncFilenameFromStack` -> `parseApiFilenameFromStack`
- `InferFaasFunc` -> `InferFaasApi`
- `FuncWarper` -> `ApiTester`
- `isTypegenSourceFile` -> `isTypegenInputFile`

Not allowed:

- `.func.ts` route support in final merged behavior
- named `api` export support
- docs or templates that still teach the old names

Alias removal target:

- remove deprecated symbol aliases in the next major after the migration release
- remove any remaining docs references before alias removal lands

## Search Commands

Run these before and after implementation:

```sh
rg --files -g '*.func.ts'
rg --files -g '*.api.ts'
rg -n '\.func\.ts|loadFunc|FuncWarper|InferFaasFunc|parseFuncFilenameFromStack|isTypegenSourceFile|export const func = defineApi' packages docs skills templates README.md
rg -n 'function file|cloud function file|Not found function file' packages docs skills templates README.md
```

Suggested targeted searches during migration:

```sh
rg -n '\.func\.ts' packages/create-faas-app templates benchmarks
rg -n '\.func\.ts|InferFaasFunc|isTypegenSourceFile' packages/dev
rg -n '\.func\.ts|loadFunc|function file' packages/node-utils
rg -n '\.func\.ts|parseFuncFilenameFromStack|Not found function file' packages/core
rg -n '\.func\.ts|export const func = defineApi|loadFunc|FuncWarper' skills docs
```

## Acceptance Criteria

The refactor is complete when all of the following are true:

- no runtime route lookup still targets `.func.ts`
- no template or scaffold generates `.func.ts`
- no public docs teach `export const func = defineApi(...)`
- no public docs teach `loadFunc`, `FuncWarper`, or `InferFaasFunc` as the
  preferred names
- typegen outputs reference `InferFaasApi`
- Vite watcher and typegen respond to `.api.ts`
- tests pass after renaming fixture files
- generated docs and docs site build successfully
- remaining `func` references are limited to:
  - low-level runtime terms such as `Func` and `FuncConfig`
  - deprecated alias shims during the migration window
  - changelog / migration notes that intentionally describe the old name

## Known Risks

- Leaving both `.func.ts` and `.api.ts` lookup support in merged code creates
  route ambiguity and extra agent confusion.
- Updating docs without templates will keep regenerating the wrong examples.
- Updating code without generated docs will leave stale API pages checked in.
- Snapshot and string-based tests are likely to fail on user-facing error text
  such as "function file" versus "API file".
- Some low-level docs legitimately keep `Func`; avoid over-correcting those
  references into misleading `api` terms.

## Explicitly Out Of Scope For This Refactor

- renaming `packages/core/src/func`
- renaming `Func` to `Api`
- renaming `FuncConfig` or `FuncPluginConfig`
- renaming `InferFaasAction`
- adding new `ApiEventType` / `ApiReturnType` aliases
- renaming internal fixture directories named `funcs/` unless necessary

## Recommended PR Breakdown

If this work is split across multiple PRs or commits, prefer this order:

1. runtime + tests
2. typegen + node-utils + type surface
3. templates + scaffolding + benchmarks
4. source-of-truth docs + published docs + changelog
5. generated docs + full validation

Do not merge the series halfway through unless every user-facing surface already
agrees on the new terminology.
