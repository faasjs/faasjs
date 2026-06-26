---
name: faasjs-react-ant-design
description: 'Use when building or reviewing FaasJS React UI, especially @faasjs/ant-design pages, useFaas, useFaasStream, faas event requests, CRUD screens, Table faasData, Description faasData, Form faas, drawers/modals, React hooks, createWindowStates shared state, and React tests.'
---

# FaasJS React And Ant Design

## Default Workflow

1. Start from feature-local files under `features/<feature>/`.
2. Use `@faasjs/ant-design` request exports in Ant Design apps so request errors and feedback stay consistent.
3. Use `useFaas` for component-owned requests, `faas` for event handlers, `Form` `faas` for submits, and `useFaasStream` for streaming.
4. Avoid native `useEffect` by default; use FaasJS React lifecycle helpers for side effects and non-primitive dependencies.
5. Use `createWindowStates` for shared state whose data changes must be propagated across independent components or component trees.
6. For CRUD, compose list, detail, create/update, and delete from shared feature metadata rather than separate one-off flows.

## Load These References

- Component and hook rules: `references/guidelines/react.md`.
- Request flow selection and lifecycle controls: `references/guidelines/react-data-fetching.md`.
- `@faasjs/ant-design` page, route, CRUD, and feedback patterns: `references/guidelines/ant-design.md`.
- React request-flow and component tests: `references/guidelines/react-testing.md`.
- Complete CRUD vertical slice composition: `references/guidelines/crud-patterns.md`.

## Gotchas

- Import `faas`, `useFaas`, `useFaasStream`, `FaasReactClient`, `FaasDataWrapper`, and `withFaasData` from `@faasjs/ant-design` in Ant Design apps.
- Import `createWindowStates` from `@faasjs/react`; create a stable feature-local state channel and export the generated `useXxx`, `setXxx`, and `xxxRef` helpers.
- Destructure hook returns at the call site; do not keep broad `result` or `states` objects.
- Keep React event handlers inline by default; extract only for reuse or real boundaries.
- For object or array dependencies, use equal memo/effect helpers instead of native dependency arrays.
- Prefer `useStates` or `useStatesRef` for component-local state, and `createSplittingContext` for provider-scoped shared state; reach for `createWindowStates` when data-change notifications must cross components, regardless of where the setter is called.

## Validation

- Use `vp test <pattern>` for affected component, hook, or request-flow tests.
- Use `setMock` for request-layer React tests.
- Run `vp check --fix` before handoff when UI files changed.
