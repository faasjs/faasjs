# FaasJS Project Goal Roadmap

This checklist turns the updated FaasJS product direction into executable work for future coding agents.

## Goal

Shift FaasJS from being described mainly as a React-only, agent-friendly, low-dependency full-stack framework to being a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications.

FaasJS should provide a chef-selected default path across React, Ant Design, typed APIs, PostgreSQL, validation, testing, plugins, project conventions, and agent-readable best practices. Replacement remains possible, but official docs, templates, examples, and review standards should optimize the curated path first.

## Guardrails For Agents

- [ ] Read `AGENTS.md`, `CONTRIBUTING.md`, `contributing/target-users.md`, and `contributing/documentation-sync.md` before making changes.
- [ ] Keep each PR focused on one phase or one coherent subset of a phase.
- [ ] Sync source-of-truth docs, English docs, Chinese docs, and navigation together when adding or changing best-practice guidance.
- [ ] Do not edit generated docs under `packages/**/{classes,functions,interfaces,type-aliases,variables}` directly.
- [ ] Do not make `@faasjs/ant-design`, `@faasjs/pg`, auth, or any business-specific plugin mandatory in core APIs.
- [ ] Treat replacement paths as escape hatches, not parallel first-class tracks.
- [ ] Prefer templates, examples, best-practice guides, and stable conventions over Rails-style generator commands.
- [ ] Keep auth and permissions as business-specific plugin patterns, not a framework-level built-in auth system.
- [ ] Validate the smallest meaningful scope before handoff.

## Phase 1: Align Product Direction

- [x] Update `contributing/target-users.md` core thesis to describe FaasJS as a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications.
- [x] Move `minimal dependencies` out of the top-level product thesis and reframe it as intentional dependency governance.
- [x] Add a `What Curated Means` section explaining that FaasJS makes a small number of strong official choices and makes them work well together.
- [x] Document the curated default path: React, Ant Design, PostgreSQL, `@faasjs/pg`, typed APIs, schema validation, Vitest, Vite Plus, plugins, and agent-readable best practices.
- [x] Update `Primary Users` and `Product Fit` language around database-driven React business applications.
- [x] Add an `Auth And Permissions` section explaining that auth is a business-specific extension point demonstrated through plugins, not built into core.
- [x] Add an `Official Batteries` section reflecting the current package layering and future evaluation criteria.
- [x] Add a `No Rails-style Generators` section explaining why FaasJS invests in agent-readable conventions instead of generator-heavy workflows.
- [x] Add a `Replaceability` section stating that stack replacement is allowed but not optimized as a parallel first-class path.
- [x] Add a `Differentiation` section explaining the difference from assembling Next.js, Prisma, shadcn/ui, NestJS, Rails, Redwood, or similar stacks manually.
- [x] Update proposal review questions to prioritize curated main-path value, full-stack application slices, reduced architecture decisions, plugin boundaries, and agent-readable structure.
- [x] Update rejection signals to reject ecosystem neutrality, broad configurability, generator-heavy surfaces, and alternative-stack complexity unless they improve the curated path.

## Phase 2: Sync Public Positioning

- [ ] Update `README.md` opening copy with the new Rails-inspired curated framework positioning.
- [ ] Rewrite `README.md` feature sections around concrete product outcomes: curated default stack, typed API workflow, PostgreSQL-first workflow, Ant Design business UI path, agent-readable conventions, and replaceable but opinionated defaults.
- [ ] Update `README.md` learning links to prioritize `create-faas-app`, the admin template, the guide, and future application slice examples.
- [ ] Update the root `package.json` `description` to match the new positioning.
- [ ] Update `docs/site/site.config.ts` English description and footer to match the new positioning.
- [ ] Update Chinese site description/footer if present in `docs/site/site.config.ts`.
- [ ] Search the repo for old positioning terms such as `React-only`, `minimal dependencies`, and `agent-friendly full-stack` and update user-facing occurrences where appropriate.
- [ ] Preserve technical statements where `React-only` is still needed to describe the official frontend boundary.

## Phase 3: Improve create-faas-app Onboarding

- [ ] Rewrite `packages/create-faas-app/README.md` as a user-facing starter guide instead of only generated API-doc style content.
- [ ] Add a `Quick Start` section with the recommended command to create a FaasJS app.
- [ ] Add a `Templates` section comparing `admin` and `minimal`.
- [ ] Document that `admin` is the default golden path for the curated stack.
- [ ] Document that `minimal` is for core/API-only/custom UI starting points.
- [ ] Add a `What The Admin Starter Shows` section covering React, Ant Design, typed API, PostgreSQL migration, pg-dev tests, type declarations, and `.env.example`.
- [ ] Add a `Next Steps` section linking to guides and docs.
- [ ] Make clear that auth is demonstrated as a plugin pattern when added, not as a core built-in.
- [ ] Run create-faas-app tests after README or template-related changes if test fixtures depend on content.

## Phase 4: Add Curated Stack Guidance

- [ ] Add `skills/faasjs-best-practices/guidelines/curated-stack.md` as the source-of-truth best-practice guide for the curated stack.
- [ ] Add `docs/guidelines/curated-stack.md` with the English published version.
- [ ] Add `docs/zh/guidelines/curated-stack.md` with the Chinese published version.
- [ ] Cover React as the official frontend stack.
- [ ] Cover Ant Design as the default business UI path.
- [ ] Cover PostgreSQL as the default relational database path.
- [ ] Cover `defineApi` and schema validation as the typed API path.
- [ ] Cover plugin conventions as the business-specific extension mechanism.
- [ ] Cover auth and permissions as plugin-based patterns, not core features.
- [ ] Cover replacement paths as allowed escape hatches, not equal official tracks.
- [ ] Add `curated-stack.md` to `skills/faasjs-best-practices/SKILL.md`.
- [ ] Add the guide to `docs/guide/README.md`.
- [ ] Add the guide to `docs/zh/guide/README.md`.
- [ ] Add the guide to `docs/site/site.config.ts` navigation.
- [ ] Build docs after navigation changes.

## Phase 5: Reframe Guide Information Architecture

- [ ] Update `docs/guide/README.md` from a flat best-practices index into a main-path learning entry.
- [ ] Update `docs/zh/guide/README.md` similarly.
- [ ] Add a recommended reading order: curated stack, project config, file conventions, defineApi, React data fetching, Ant Design, PG guides, plugin spec, application slices.
- [ ] Add a short explanation of how complete application slices replace a generator-heavy workflow.
- [ ] Ensure English and Chinese guide indexes remain aligned.
- [ ] Update `docs/site/site.config.ts` sidebar ordering if needed.
- [ ] Run `cd docs && npm run build` after docs navigation updates.

## Phase 6: Strengthen Admin Template As Golden Path

- [ ] Audit `packages/create-faas-app/template/admin` for the full UI -> API -> DB -> test flow.
- [ ] Ensure the admin template demonstrates React page structure clearly.
- [ ] Ensure the admin template demonstrates Ant Design form/table/feedback patterns where practical.
- [ ] Ensure the admin template demonstrates a typed API endpoint.
- [ ] Ensure the admin template demonstrates a PostgreSQL migration.
- [ ] Ensure the admin template demonstrates pg-dev-powered tests.
- [ ] Ensure the admin template includes clear type declarations for `@faasjs/pg` table typing.
- [ ] Ensure `.env.example` and related setup instructions are easy to follow.
- [ ] Keep the template small enough to teach the pattern without becoming a full product.
- [ ] Run create-faas-app tests and any relevant template tests.

## Phase 7: Add Simple Auth Plugin Demo

- [ ] Design a minimal auth plugin demo for `packages/create-faas-app/template/admin`.
- [ ] Keep the demo scoped to plugin mechanics and current-user injection.
- [ ] Add a plugin file, for example `src/plugins/auth.ts`, if it fits existing conventions.
- [ ] Demonstrate reading a user from a simple request source such as a header, cookie, or mock token.
- [ ] Demonstrate injecting `current_user` or equivalent request context into APIs.
- [ ] Add one protected API example.
- [ ] Add a frontend call or UI snippet showing authenticated context if it keeps the template readable.
- [ ] Add tests for the protected API and auth plugin behavior.
- [ ] Document that production auth, password login, OAuth, sessions, RBAC, and multi-tenancy are intentionally out of scope for the demo.
- [ ] Update create-faas-app tests if generated file lists or content assertions change.
- [ ] Run relevant tests.

## Phase 8: Document Application Slices

- [ ] Add `skills/faasjs-best-practices/guidelines/application-slices.md` as the source-of-truth guide.
- [ ] Add `docs/guidelines/application-slices.md` with the English published version.
- [ ] Add `docs/zh/guidelines/application-slices.md` with the Chinese published version.
- [ ] Define a complete business application slice as page, API, schema, database migration/types, and tests.
- [ ] Explain how agents should work along slice boundaries when adding or changing features.
- [ ] Include a recommended file layout for a common slice such as users or orders.
- [ ] Include guidance for when to keep code inline versus extracting helpers/components/hooks.
- [ ] Explain why FaasJS does not prioritize Rails-style generators.
- [ ] Add the guide to `skills/faasjs-best-practices/SKILL.md`.
- [ ] Add the guide to `docs/guide/README.md`.
- [ ] Add the guide to `docs/zh/guide/README.md`.
- [ ] Add the guide to `docs/site/site.config.ts` navigation.
- [ ] Build docs after navigation changes.

## Phase 9: Add Application Slice Examples

- [ ] Decide whether examples belong in the admin template, `templates/*`, or a dedicated docs/example location.
- [ ] Add one complete starter slice first, preferably `users`.
- [ ] Include a migration for the slice.
- [ ] Include type declarations or table type updates for the slice.
- [ ] Include create/list/detail/update APIs where appropriate.
- [ ] Include React pages using the recommended Ant Design components.
- [ ] Include API and PG tests.
- [ ] Keep the example copyable by AI coding agents without requiring generator commands.
- [ ] Add a second slice such as `orders`, `settings`, or `audit_logs` only after the first slice pattern is stable.
- [ ] Update docs to point to the example slice.
- [ ] Run template and package tests that cover the examples.

## Phase 10: Refine Dependency And Batteries Governance

- [ ] Rename or reframe the dependency principle in `contributing/target-users.md` from minimalism to intentional dependencies.
- [ ] Add criteria for accepting an official dependency: strengthens the curated path, reduces repeated business-app work, supports a complete workflow, and does not leak into core unnecessarily.
- [ ] Add criteria for rejecting dependencies: niche convenience, ecosystem neutrality, speculative abstraction, or alternative-stack support that does not improve the main path.
- [ ] Document current official batteries: core runtime, routing, HTTP helpers, typed API conventions, React bindings, Ant Design UI, PostgreSQL migration/query/testing workflow, Node utilities, plugin conventions, dev tooling, templates, and scheduled tasks.
- [ ] Document future battery candidates: seed data, fixtures, uploads, queues, and mailers.
- [ ] State that future batteries should be evaluated by whether they strengthen database-driven React business applications.
- [ ] Ensure future batteries can be layered as official packages or plugins without bloating core.

## Validation Checklist

- [ ] For docs content or navigation changes, run `cd docs && npm run build`.
- [ ] For JSDoc or exported API changes, run `vp run doc`.
- [ ] For create-faas-app code or template changes, run the create-faas-app test suite.
- [ ] For PG template changes, run relevant pg-dev/template tests.
- [ ] For cross-cutting changes, run `npm test` or the smallest meaningful workspace-wide validation.
- [ ] Confirm English and Chinese docs stay synchronized for new or changed best-practice guidance.
- [ ] Confirm no generated docs were edited by hand.
- [ ] Confirm `CHANGELOG.md` impact was considered for user-visible workflow or documentation changes.

## Suggested PR Order

- [ ] PR 1: Product direction and public positioning.
  - [ ] `contributing/target-users.md`
  - [ ] `README.md`
  - [ ] root `package.json`
  - [ ] `docs/site/site.config.ts`
- [ ] PR 2: Curated stack guide and docs navigation.
  - [ ] `skills/faasjs-best-practices/guidelines/curated-stack.md`
  - [ ] `docs/guidelines/curated-stack.md`
  - [ ] `docs/zh/guidelines/curated-stack.md`
  - [ ] guide indexes and site config
- [ ] PR 3: create-faas-app onboarding.
  - [ ] `packages/create-faas-app/README.md`
  - [ ] admin/minimal template descriptions
- [ ] PR 4: Admin template auth plugin demo.
  - [ ] minimal auth plugin pattern
  - [ ] protected API example
  - [ ] tests and docs notes
- [ ] PR 5: Application slice guidance and first example.
  - [ ] `application-slices.md` docs
  - [ ] one complete example slice

## Completion Criteria

- [ ] README, site metadata, contribution guide, best practices, docs navigation, and create-faas-app onboarding all describe the same product direction.
- [ ] Users can identify FaasJS as a curated full-stack framework for database-driven React business applications.
- [ ] The default stack is clear and supported by templates, docs, and examples.
- [ ] Auth and permissions are documented as plugin-based business extension points, not core framework features.
- [ ] The Rails-inspired direction is implemented through conventions, templates, full application slices, and agent-readable guides rather than generator-heavy workflows.
- [ ] Future features can be evaluated by whether they strengthen the curated main path and complete business application slices.
