# React Guide

Use for React feature UI, components, hooks, dependency handling, derived state, and `@faasjs/react` helpers in FaasJS projects.

## Applicable Scenarios

- Creating new React feature UI, components, or hooks
- Reviewing hook usage and dependency handling
- Deciding whether state should be derived, memoized, or synced
- Handling object, array, or function type dependencies
- Choosing between native React hooks and `@faasjs/react` helpers

## Default Workflow

1. Keep render logic pure and derive values inline when possible.
2. Use event handlers for user-driven updates.
3. Avoid native `useEffect` by default; use `useEqualEffect` only for real side effects.
4. Use `useStates` for component-local state instead of React `useState`.
5. Use `useStatesRef` when component-local state also needs latest-value refs.
6. Use equal memo hooks for object, array, or function dependencies.
7. Reach for state, context, and rendering helpers only when they solve a specific problem.
8. Keep data-fetching choices explicit; read [React Data Fetching Guide](./react-data-fetching.md) for request flows.
9. Receive component inputs as `props` and read `props.xxx`; destructure React hook returns at the call site.

## Rules

### 1. Avoid native `useEffect` by default

Prefer derived values in render instead of mirroring props or state through `useEffect`. Use event handlers for actions that can run directly from user interaction.

Prefer:

```tsx
type Props = { firstName: string; lastName: string }

export function DisplayName(props: Props) {
  const fullName = `${props.firstName} ${props.lastName}`

  return <div>{fullName}</div>
}
```

Avoid:

```tsx
import { useEffect, useState } from 'react'

type Props = { firstName: string; lastName: string }

export function DisplayName(props: Props) {
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(`${props.firstName} ${props.lastName}`)
  }, [props.firstName, props.lastName])

  return <div>{fullName}</div>
}
```

### 2. Use `useEqualEffect` for real side effects

```tsx
import { useEqualEffect } from '@faasjs/react'

type Props = { page: number; tags: string[] }

export function Logger(props: Props) {
  useEqualEffect(() => {
    logger.info('filters changed', { page: props.page, tags: props.tags })
  }, [props.page, props.tags])

  return <div>Current page: {props.page}</div>
}
```

- Use instead of native `useEffect` in this repo.
- Keep responsibilities narrow and side-effect focused.
- Prefer especially when dependencies include objects, arrays, or nested params.

### 3. Use equal memo hooks for non-primitive dependencies

Use `useEqualMemo` for computed values with deep dependencies:

```tsx
import { useEqualMemo } from '@faasjs/react'

type Props = { filters: Record<string, any> }

export function QueryPreview(props: Props) {
  const query = useEqualMemo(() => JSON.stringify(props.filters), [props.filters])

  return <div>Query: {query}</div>
}
```

Use `useEqualCallback` for callbacks with deep dependencies:

```tsx
import { useEqualCallback } from '@faasjs/react'

type Props = { onSearch: (query: string) => void; filters: Record<string, any> }

export function SearchButton(props: Props) {
  const handleSearch = useEqualCallback(
    () => props.onSearch(JSON.stringify(props.filters)),
    [props.filters, props.onSearch],
  )

  return <button onClick={handleSearch}>Search</button>
}
```

Use `useEqualMemoize` for value stabilization without a computation:

```tsx
import { useEqualMemoize } from '@faasjs/react'

type Props = { filters: Record<string, any> }

export function SearchPanel(props: Props) {
  const stableFilters = useEqualMemoize(props.filters)

  return <div>Stable: {JSON.stringify(stableFilters)}</div>
}
```

- If dependencies are primitives and computation is cheap, inline it.

### 4. Use `useStates` for component-local state

`useStates`: default local state with matching setters.

```tsx
import { useStates } from '@faasjs/react'

export function SearchBox() {
  const { keyword, setKeyword, setPage } = useStates({ keyword: '', page: 1 })

  return (
    <div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <button onClick={() => setPage((page) => page + 1)}>Next page</button>
    </div>
  )
}
```

- Prefer `useStates` over React `useState` for component-local state.
- Destructure the fields used from `useStates` at the call site.
- Group related local fields in one `useStates` call.

### 5. Use other state helpers only for their specific jobs

`useConstant`: create one value per component instance.

```tsx
import { useConstant } from '@faasjs/react'

export function IdDisplay() {
  const id = useConstant(() => crypto.randomUUID())

  return <div>ID: {id}</div>
}
```

`usePrevious`: compare current and previous values when it improves clarity.

```tsx
import { usePrevious } from '@faasjs/react'

export function CountDisplay(props: { count: number }) {
  const prev = usePrevious(props.count)

  return (
    <div>
      Current: {props.count}, Previous: {prev}
    </div>
  )
}
```

`useStatesRef`: async callbacks, timers, subscriptions, or other delayed work need both state and latest-value refs.

```tsx
import { useStatesRef } from '@faasjs/react'

export function AsyncCounter() {
  const { count, setCount, countRef } = useStatesRef({ count: 0 })

  const logLater = () => {
    setTimeout(() => {
      console.log('Count at call time:', countRef.current)
    }, 1000)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={logLater}>Log later</button>
    </div>
  )
}
```

- Prefer `useStatesRef` over pairing `useStates` with separate refs when the same local fields need current state and latest-value refs.
- Destructure the fields and refs used from `useStatesRef` at the call site.

### 6. Split shared state deliberately

Use `createSplittingContext` when one state object is shared and its fields change independently. Use `useStates` to build the provider value with matching setters. Use `useStatesRef` only when the same provider state also needs latest-value refs. Prefer this over putting a large mutable object into one normal context.

```tsx
import { createSplittingContext, useStates } from '@faasjs/react'

const CounterContext = createSplittingContext<{
  count: number
  setCount: (value: number) => void
  keyword: string
  setKeyword: (value: string) => void
}>(['count', 'setCount', 'keyword', 'setKeyword'])

function Filters() {
  const { keyword, setKeyword } = CounterContext.use()

  return <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
}

function Count() {
  const { count, setCount } = CounterContext.use()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

export function Page() {
  const { count, setCount, keyword, setKeyword } = useStates({ count: 0, keyword: '' })

  return (
    <CounterContext.Provider value={{ count, setCount, keyword, setKeyword }}>
      <Filters />
      <Count />
    </CounterContext.Provider>
  )
}
```

### 7. Use rendering helpers at composition boundaries

`OptionalWrapper`: same children sometimes need a wrapper and sometimes render directly.

```tsx
import { OptionalWrapper } from '@faasjs/react'
import { Card } from 'antd'

export function Widget(props: { wrapper?: boolean; children: React.ReactNode }) {
  return (
    <OptionalWrapper
      condition={Boolean(props.wrapper)}
      Wrapper={Card}
      wrapperProps={{ size: 'small' }}
    >
      {props.children}
    </OptionalWrapper>
  )
}
```

`ErrorBoundary`: unstable widgets, remote content, or feature islands where local failure should not break the whole page.

```tsx
import { ErrorBoundary } from '@faasjs/react'

export function SafeWidget(props: { content: string }) {
  return (
    <ErrorBoundary errorChildren={<div>Something went wrong</div>}>
      <div>{props.content}</div>
    </ErrorBoundary>
  )
}
```

- Keep fallbacks simple and user-facing.

### 8. Keep request/client choices explicit

- Use `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData` intentionally.
- Configure `FaasReactClient` centrally.
- Use `getClient` only for multiple Faas clients.
- Read [React Data Fetching Guide](./react-data-fetching.md) for detailed request-flow patterns.

## Review Checklist

- native `useEffect` is not used for normal React logic
- derived state is computed inline instead of mirrored through effects
- component-local state uses `useStates` instead of React `useState`
- component-local state with latest-value refs uses `useStatesRef`
- React hook return values are destructured at the call site
- object or array dependencies use equal hook variants
- memoization solves real stability or performance needs
- state, context, rendering, request, and client helpers are used for their specific purposes
- data fetching and testing follow the dedicated guides below
