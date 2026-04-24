# Testing Guide

Use this guide when writing or reviewing tests in FaasJS projects.

## Use This Guide When

- writing or reviewing tests for APIs, utilities, hooks, components, or runtime helpers
- deciding whether to keep a dependency real or replace it with a mock
- choosing the smallest useful test level for a scenario
- checking whether a test protects behavior instead of implementation details

## Default Workflow

1. Start from the public behavior or regression the test should catch.
2. Choose the smallest test level that can still exercise the real boundary.
3. Keep local business logic, helpers, hooks, and components real unless a clear boundary requires isolation.
4. Mock only external, nondeterministic, expensive, or otherwise hard-to-control boundaries.
5. Keep mock setup explicit, local to the scenario, and smaller than the real behavior it replaces.
6. Cover the success path plus the failure or state-transition paths callers actually rely on.
7. Reset shared global state, timers, env, and mocks between cases.
8. Before handoff, run `vp check` and `vp test` as acceptance gates; if either command cannot run in the current environment, record the blocker and the narrower validation that still ran.

## Rules

### 1. Test public behavior instead of implementation details

- Assert returned data, rendered output, raised errors, written response fields, or other externally visible effects.
- Avoid asserting internal call order, private helper usage, intermediate state shape, or framework internals unless that is the contract.
- A refactor that preserves behavior should usually not require rewriting the test.

### 2. Prefer real dependencies inside the boundary under test

- Keep local functions, hooks, child components, schemas, and helpers real when the scenario can be reached through public input.
- This exposes dependency and integration regressions earlier instead of hiding them behind test doubles.
- Do not mock just to make a test shorter if that removes the part most likely to break in production.

### 3. Mock only the narrowest boundary that must be isolated

- Good mock boundaries are usually network calls, database access, clocks, random values, filesystem, process env, or third-party services.
- If a lower-level test needs many internal mocks to work, move up to a higher-level test instead.
- When a mock is required, make the contract explicit and keep the fake behavior smaller than the production behavior.

### 4. Use the smallest test level that still builds confidence

- Use pure or unit tests for isolated logic.
- Use handler or API tests for endpoint contracts, validation, and HTTP behavior.
- Use component or hook tests for UI behavior.
- Prefer the level that exercises real integration without needing a large web of internal mocks.

### 5. Cover the paths users and callers rely on

- success path
- meaningful validation or error path
- boundary failure when the integration can fail in production
- reload, retry, or state-transition behavior when the feature supports it
- cleanup or reset behavior when shared state is involved

## Review Checklist

- the test asserts public behavior
- local dependencies stay real unless a clear boundary requires isolation
- mocks are explicit and placed only at narrow external boundaries
- mock behavior is simpler than the real behavior it replaces
- the chosen test level matches the risk and avoids unnecessary internal mocking
- success and meaningful failure paths are covered
- shared state, timers, env, and globals are reset between cases

## Read Next

- [defineApi Guide](./define-api.md)
- [React Testing Guide](./react-testing.md)
- [Node Utils Guide](./node-utils.md)
