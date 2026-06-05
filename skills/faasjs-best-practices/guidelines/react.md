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
4. Use equal memo hooks for object, array, or function dependencies.
5. Reach for state, context, and rendering helpers only when they solve a specific problem.
6. Keep data-fetching choices explicit; read [React Data Fetching Guide](./react-data-fetching.md) for request flows.

## Rules

### 1. Avoid native `useEffect` by default

Prefer derived values in render instead of mirroring props or state through `useEffect`. Use event handlers for actions that can run directly from user interaction.

Prefer:

```tsx
import { useState } from 'react'

type Props = { firstName: string; lastName: string }

export function DisplayName({ firstName, lastName }: Props) {
  const fullName = `${firstName} ${lastName}`

  return <div>{fullName}</div>
}
```

Avoid:

```tsx
import { useEffect, useState } from 'react'

type Props = { firstName: string; lastName: string }

export function DisplayName({ firstName, lastName }: Props) {
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`)
  }, [firstName, lastName])

  return <div>{fullName}</div>
}
```

### 2. Use `useEqualEffect` for real side effects

```tsx
import { useEqualEffect } from '@faasjs/react'

type Props = { page: number; tags: string[] }

export function Logger({ page, tags }: Props) {
  useEqualEffect(() => {
    logger.info('filters changed', { page, tags })
  }, [page, tags])

  return <div>Current page: {page}</div>
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

export function QueryPreview({ filters }: Props) {
  const query = useEqualMemo(() => JSON.stringify(filters), [filters])

  return <div>Query: {query}</div>
}
```

Use `useEqualCallback` for callbacks with deep dependencies:

```tsx
import { useEqualCallback } from '@faasjs/react'

type Props = { onSearch: (query: string) => void; filters: Record<string, any> }

export function SearchButton({ onSearch, filters }: Props) {
  const handleSearch = useEqualCallback(
    () => onSearch(JSON.stringify(filters)),
    [filters, onSearch],
  )

  return <button onClick={handleSearch}>Search</button>
}
```

Use `useEqualMemoize` for value stabilization without a computation:

```tsx
import { useEqualMemoize } from '@faasjs/react'

type Props = { filters: Record<string, any> }

export function SearchPanel({ filters }: Props) {
  const stableFilters = useEqualMemoize(filters)

  return <div>Stable: {JSON.stringify(stableFilters)}</div>
}
```

- If dependencies are primitives and computation is cheap, inline it.

### 4. Use state helpers only for their specific jobs

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

`useStateRef`: async callbacks, timers, or subscriptions need both state and latest-value ref.

```tsx
import { useStateRef } from '@faasjs/react'

export function AsyncCounter() {
  const [count, setCount, countRef] = useStateRef(0)

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

- Do not replace normal `useState` with `useStateRef` unless the live ref is needed.

### 5. Split multi-field shared state deliberately

Use `createSplittingContext` when one context object has fields that change independently. Use `useStates` to build a small object state container with matching setters. Use `useStatesRef` when the same state fields also need latest-value refs. Prefer this over putting a large mutable object into one normal context.

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
  const states = useStates({ count: 0, keyword: '' })

  return (
    <CounterContext.Provider value={states}>
      <Filters />
      <Count />
    </CounterContext.Provider>
  )
}
```

### 6. Use rendering helpers at composition boundaries

`OptionalWrapper`: same children sometimes need a wrapper and sometimes render directly.

```tsx
import { OptionalWrapper } from '@faasjs/react'

export function Widget(props: { wrapper?: boolean; children: React.ReactNode }) {
  return (
    <OptionalWrapper wrapper={props.wrapper} renderWrapper={(children) => <Card>{children}</Card>}>
      {props.children}
    </OptionalWrapper>
  )
}
```

`ErrorBoundary`: unstable widgets, remote content, or feature islands where local failure should not break the whole page.

```tsx
import { ErrorBoundary } from '@faasjs/react'

export function SafeWidget({ content }: { content: string }) {
  return (
    <ErrorBoundary errorChildren={<div>Something went wrong</div>}>
      <div>{content}</div>
    </ErrorBoundary>
  )
}
```

- Keep fallbacks simple and user-facing.

### 7. Keep request/client choices explicit

- Use `useFaas`, `useFaasStream`, `faas`, `FaasDataWrapper`, and `withFaasData` intentionally.
- Configure `FaasReactClient` centrally.
- Use `getClient` only for multiple Faas clients.
- Read [React Data Fetching Guide](./react-data-fetching.md) for detailed request-flow patterns.

## Review Checklist

- native `useEffect` is not used for normal React logic
- derived state is computed inline instead of mirrored through effects
- object or array dependencies use equal hook variants
- memoization solves real stability or performance needs
- state, context, rendering, request, and client helpers are used for their specific purposes
- data fetching and testing follow the dedicated guides below
