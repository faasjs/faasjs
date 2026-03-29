# React Guide

Use this guide when creating or reviewing React pages, components, or hooks in FaasJS projects.

## Use This Guide When

- creating a new React page, component, or hook
- reviewing hook usage and dependency handling
- deciding whether state should be derived, memoized, or synchronized
- handling object, array, or function dependencies
- choosing between native React hooks and `@faasjs/react` helpers

## Default Workflow

1. Keep render logic pure and derive values inline when possible.
2. Use event handlers for user-driven updates.
3. Avoid native `useEffect`.
4. When a side effect is truly required, use `useEqualEffect`.
5. When memoizing values or callbacks with non-primitive dependencies, use the equal hooks from `@faasjs/react`.
6. Reach for state, context, and rendering helpers only when they solve a specific problem.

## Rules

### 1. Avoid `useEffect` by default

- Do not reach for native `useEffect` as the default solution for React logic.
- Do not use effects to derive render data from props or state.
- Do not use effects to mirror props into state unless there is a clear external-state reason.
- Do not use effects to trigger code that can run directly in an event handler.

Prefer this:

```tsx
type Props = {
  firstName: string
  lastName: string
}

export function UserName(props: Props) {
  const fullName = `${props.firstName} ${props.lastName}`

  return <span>{fullName}</span>
}
```

Avoid this:

```tsx
type Props = {
  firstName: string
  lastName: string
}

export function UserName(props: Props) {
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(`${props.firstName} ${props.lastName}`)
  }, [props.firstName, props.lastName])

  return <span>{fullName}</span>
}
```

### 2. Use `useEqualEffect` uniformly for side effects

- In this repo, use `useEqualEffect` instead of native `useEffect`.
- Keep effect responsibilities narrow and side-effect focused.
- This is especially important when dependencies include objects, arrays, or nested params.

Example:

```tsx
import { useEqualEffect } from '@faasjs/react'

type Props = {
  filters: {
    page: number
    tags: string[]
  }
}

export function SearchLogger({ filters }: Props) {
  useEqualEffect(() => {
    console.log('filters changed', filters)
  }, [filters])

  return null
}
```

### 3. Use equal memo hooks for non-primitive dependencies

- Prefer `useEqualMemo` over `useMemo` for memoized values with deep dependencies.
- Prefer `useEqualCallback` over `useCallback` for callbacks with deep dependencies.
- Prefer `useEqualMemoize` when the goal is value stabilization instead of computation memoization.
- If dependencies are only primitives, inline computation is often simpler than any memo hook.

`useEqualMemo` example:

```tsx
import { useEqualMemo } from '@faasjs/react'

type Props = {
  filters: Record<string, any>
}

export function QueryPreview({ filters }: Props) {
  const query = useEqualMemo(() => JSON.stringify(filters), [filters])

  return <pre>{query}</pre>
}
```

`useEqualCallback` example:

```tsx
import { useEqualCallback } from '@faasjs/react'

type Props = {
  filters: Record<string, any>
  onSearch(filters: Record<string, any>): void
}

export function SearchButton({ filters, onSearch }: Props) {
  const handleClick = useEqualCallback(() => {
    onSearch(filters)
  }, [filters, onSearch])

  return <button onClick={handleClick}>Search</button>
}
```

`useEqualMemoize` example:

```tsx
import { useEqualMemoize } from '@faasjs/react'

type Props = {
  filters: Record<string, any>
}

export function SearchPanel({ filters }: Props) {
  const stableFilters = useEqualMemoize(filters)

  return <pre>{JSON.stringify(stableFilters)}</pre>
}
```

### 4. Use state helpers only for the specific problems they solve

- Use `useConstant` for values that should be created once per component instance.
- Use `usePrevious` when comparing current and previous props or state improves clarity.
- Use `useStateRef` when async callbacks, timers, or subscriptions need both React state and a ref that always points to the latest value.
- Do not replace normal `useState` with `useStateRef` unless the live ref is genuinely needed.

`useConstant` example:

```tsx
import { useConstant } from '@faasjs/react'

export function RequestId() {
  const requestId = useConstant(() => crypto.randomUUID())

  return <div>{requestId}</div>
}
```

`usePrevious` example:

```tsx
import { usePrevious } from '@faasjs/react'

export function ValueHistory({ value }: { value: number }) {
  const previous = usePrevious(value)

  return (
    <div>
      {previous} -> {value}
    </div>
  )
}
```

`useStateRef` example:

```tsx
import { useStateRef } from '@faasjs/react'

export function Counter() {
  const [count, setCount, countRef] = useStateRef(0)

  async function submitLater() {
    await Promise.resolve()
    console.log(countRef.current)
  }

  return (
    <div>
      <button type="button" onClick={() => setCount((p) => p + 1)}>
        {count}
      </button>
      <button type="button" onClick={submitLater}>
        Submit
      </button>
    </div>
  )
}
```

### 5. Use splitting context for multi-field shared state

- Use `createSplittingContext` when one context object contains multiple fields that change independently.
- Its `Provider` and `use` helpers help reduce unnecessary rerenders by splitting reads by key.
- Use `useSplittingState` when you want to build a small state container from an object and automatically get matching setters.
- Prefer this pattern for complex local state sharing instead of putting a large mutable object into one normal context.

Example:

```tsx
import type { Dispatch, SetStateAction } from 'react'

import { createSplittingContext, useSplittingState } from '@faasjs/react'

const CounterContext = createSplittingContext<{
  count: number
  setCount: Dispatch<SetStateAction<number>>
  keyword: string
  setKeyword: Dispatch<SetStateAction<string>>
}>(['count', 'setCount', 'keyword', 'setKeyword'])

function Filters() {
  const { keyword, setKeyword } = CounterContext.use()

  return <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
}

function Count() {
  const { count } = CounterContext.use()

  return <span>{count}</span>
}

export function Page() {
  const value = useSplittingState({
    count: 0,
    keyword: '',
  })

  return (
    <CounterContext.Provider value={value}>
      <Filters />
      <Count />
    </CounterContext.Provider>
  )
}
```

### 6. Use rendering helpers to simplify composition boundaries

- Use `OptionalWrapper` when the same children sometimes need a wrapper and sometimes should render directly.
- Use `ErrorBoundary` around unstable widgets, remote content regions, or feature islands where local failure should not break the whole page.
- Keep `ErrorBoundary` fallbacks simple and user-facing.

`OptionalWrapper` example:

```tsx
import type { ReactNode } from 'react'

import { OptionalWrapper } from '@faasjs/react'

function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>
}

export function Widget({ bordered }: { bordered: boolean }) {
  return (
    <OptionalWrapper condition={bordered} Wrapper={Card}>
      <div>Widget content</div>
    </OptionalWrapper>
  )
}
```

`ErrorBoundary` example:

```tsx
import { ErrorBoundary } from '@faasjs/react'

function Content() {
  return <div>Widget content</div>
}

export function SafeWidget() {
  return (
    <ErrorBoundary errorChildren={<div>Widget failed</div>}>
      <Content />
    </ErrorBoundary>
  )
}
```

### 7. Keep data-fetching and client setup choices explicit

- Use `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData` intentionally instead of mixing patterns casually.
- Keep `FaasReactClient` setup centralized.
- Use `getClient` only for special cases such as multiple Faas clients.
- See the dedicated data-fetching guide for examples and tradeoffs.

## Review Checklist

- native `useEffect` is not used for normal React logic
- derived state is computed inline instead of mirrored through effects
- object or array dependencies use the equal hook variants
- memoization is only added where it solves a real stability or performance problem
- state and context helpers are used for specific problems instead of by default
- data fetching and testing follow the dedicated guides below

## Read Next

- [React Data Fetching Guide](./react-data-fetching.md)
- [React Testing Guide](./react-testing.md)
- [@faasjs/react](../references/packages/react/README.md)
- [useEqualEffect](../references/packages/react/functions/useEqualEffect.md)
- [useEqualMemo](../references/packages/react/functions/useEqualMemo.md)
- [useEqualCallback](../references/packages/react/functions/useEqualCallback.md)
- [useEqualMemoize](../references/packages/react/functions/useEqualMemoize.md)
- [useConstant](../references/packages/react/functions/useConstant.md)
- [usePrevious](../references/packages/react/functions/usePrevious.md)
- [useStateRef](../references/packages/react/functions/useStateRef.md)
- [createSplittingContext](../references/packages/react/functions/createSplittingContext.md)
- [useSplittingState](../references/packages/react/functions/useSplittingState.md)
- [OptionalWrapper](../references/packages/react/functions/OptionalWrapper.md)
- [ErrorBoundary](../references/packages/react/classes/ErrorBoundary.md)
