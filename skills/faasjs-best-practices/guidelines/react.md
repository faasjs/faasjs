# React Guide

Use for React pages, components, hooks, dependency handling, derived state, and `@faasjs/react` helpers.

## Default Workflow

1. Keep render logic pure and derive values inline when possible.
2. Use event handlers for user-driven updates.
3. Avoid native `useEffect`; use `useEqualEffect` only for real side effects.
4. Use equal memo hooks for object, array, or function dependencies.
5. Reach for state, context, and rendering helpers only when they solve a specific problem.
6. Keep data-fetching choices explicit; read [React Data Fetching Guide](./react-data-fetching.md) for request flows.

## Rules

### 1. Avoid effects for derived data

Prefer derived values in render:

```tsx
const fullName = `${firstName} ${lastName}`
```

Avoid mirroring props or state through `useEffect` just to compute render data. Use event handlers for actions that can run directly from user interaction.

### 2. Use `useEqualEffect` for real side effects

```tsx
useEqualEffect(() => {
  logger.info('filters changed', filters)
}, [filters])
```

- Use instead of native `useEffect` in this repo.
- Keep responsibilities narrow and side-effect focused.
- Prefer especially when dependencies include objects, arrays, or nested params.

### 3. Use equal memo hooks for non-primitive dependencies

```tsx
const query = useEqualMemo(() => JSON.stringify(filters), [filters])
const handleSearch = useEqualCallback(() => onSearch(filters), [filters, onSearch])
const stableFilters = useEqualMemoize(filters)
```

- Use `useEqualMemo` for computed values with deep dependencies.
- Use `useEqualCallback` for callbacks with deep dependencies.
- Use `useEqualMemoize` for value stabilization without a computation.
- If dependencies are primitives and computation is cheap, inline it.

### 4. Use state helpers only for their specific jobs

- `useConstant`: create one value per component instance.
- `usePrevious`: compare current and previous values when it improves clarity.
- `useStateRef`: async callbacks, timers, or subscriptions need both state and latest-value ref.
- Do not replace normal `useState` with `useStateRef` unless the live ref is needed.

### 5. Split multi-field shared state deliberately

- Use `createSplittingContext` when one context object has fields that change independently.
- Use `useSplittingState` to build a small object state container with matching setters.
- Prefer this over putting a large mutable object into one normal context.

```tsx
const FilterContext = createSplittingContext(['keyword', 'setKeyword', 'page', 'setPage'])
const value = useSplittingState({ keyword: '', page: 1 })
```

### 6. Use rendering helpers at composition boundaries

- `OptionalWrapper`: same children sometimes need a wrapper and sometimes render directly.
- `ErrorBoundary`: unstable widgets, remote content, or feature islands where local failure should not break the whole page.
- Keep fallbacks simple and user-facing.

### 7. Keep request/client choices explicit

- Use `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData` intentionally.
- Configure `FaasReactClient` centrally.
- Use `getClient` only for multiple Faas clients.

## Review Checklist

- native `useEffect` is not used for normal React logic
- derived state is computed inline instead of mirrored through effects
- object or array dependencies use equal hook variants
- memoization solves real stability or performance needs
- state, context, rendering, request, and client helpers are used for their specific purposes
