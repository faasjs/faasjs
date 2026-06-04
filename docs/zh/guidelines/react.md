# React 指南

在 FaasJS 项目中用于 React 功能 UI、组件、hooks、依赖处理、派生状态以及 `@faasjs/react` 辅助函数。

## 适用场景

- 创建新的 React 功能 UI、组件或 hooks
- 审查 hook 使用和依赖处理
- 决定状态应该派生、记忆还是同步
- 处理对象、数组或函数类型的依赖
- 在原生 React hooks 和 `@faasjs/react` 辅助函数之间做选择

## 默认工作流程

1. 保持渲染逻辑纯粹，尽可能内联派生值。
2. 使用事件处理器处理用户驱动的更新。
3. 默认避免使用原生 `useEffect`；仅在需要真正的副作用时使用 `useEqualEffect`。
4. 对对象、数组或函数依赖使用 equal memo hooks。
5. 仅在解决特定问题时才使用状态、上下文和渲染辅助函数。
6. 保持数据获取选择明确；阅读 [React 数据获取指南](./react-data-fetching.md) 了解请求流程。

## 规则

### 1. 默认避免使用原生 `useEffect`

优先在渲染中派生值，而不是通过 `useEffect` 镜像 props 或 state。对可以直接从用户交互触发的操作使用事件处理器。

推荐：

```tsx
import { useState } from 'react'

type Props = { firstName: string; lastName: string }

export function DisplayName({ firstName, lastName }: Props) {
  const fullName = `${firstName} ${lastName}`

  return <div>{fullName}</div>
}
```

避免：

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

### 2. 对真正的副作用使用 `useEqualEffect`

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

- 在此仓库中用其替代原生 `useEffect`。
- 保持职责范围狭窄，聚焦于副作用。
- 当依赖包含对象、数组或嵌套参数时尤其推荐使用。

### 3. 对非原始类型依赖使用 equal memo hooks

使用 `useEqualMemo` 处理带深层依赖的计算值：

```tsx
import { useEqualMemo } from '@faasjs/react'

type Props = { filters: Record<string, any> }

export function QueryPreview({ filters }: Props) {
  const query = useEqualMemo(() => JSON.stringify(filters), [filters])

  return <div>Query: {query}</div>
}
```

使用 `useEqualCallback` 处理带深层依赖的回调：

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

使用 `useEqualMemoize` 稳定值而不需要计算：

```tsx
import { useEqualMemoize } from '@faasjs/react'

type Props = { filters: Record<string, any> }

export function SearchPanel({ filters }: Props) {
  const stableFilters = useEqualMemoize(filters)

  return <div>Stable: {JSON.stringify(stableFilters)}</div>
}
```

- 如果依赖是原始类型且计算开销很小，直接内联即可。

### 4. 仅在其特定用途下使用状态辅助函数

`useConstant`：为每个组件实例创建一个值。

```tsx
import { useConstant } from '@faasjs/react'

export function IdDisplay() {
  const id = useConstant(() => crypto.randomUUID())

  return <div>ID: {id}</div>
}
```

`usePrevious`：在能提高清晰度时比较当前值和前一个值。

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

`useStateRef`：异步回调、定时器或订阅同时需要状态和最新值的 ref。

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

- 除非需要实时 ref，否则不要用 `useStateRef` 替代普通的 `useState`。

### 5. 有意识地拆分多字段共享状态

当一个上下文对象的字段独立变化时，使用 `createSplittingContext`。使用 `useSplittingState` 构建一个带匹配 setter 的小型对象状态容器。优先选择这种方式，而不是将大型可变对象放入一个普通上下文中。

```tsx
import { createSplittingContext, useSplittingState } from '@faasjs/react'

const CounterContext = createSplittingContext<{
  count: number
  setCount: (value: number) => void
  keyword: string
  setKeyword: (value: string) => void
}>()

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
  const { value, Provider } = useSplittingState({ count: 0, keyword: '' })

  return (
    <CounterContext.Provider value={value}>
      <Filters />
      <Count />
    </CounterContext.Provider>
  )
}
```

### 6. 在组合边界处使用渲染辅助函数

`OptionalWrapper`：相同的 children 有时需要包装器，有时直接渲染。

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

`ErrorBoundary`：不稳定的组件、远程内容或功能孤岛，局部故障不应导致整个页面崩溃。

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

- 保持 fallback 简单且面向用户。

### 7. 保持请求/客户端选择明确

- 有目的地使用 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 和 `withFaasData`。
- 集中配置 `FaasReactClient`。
- 仅在有多个 Faas 客户端时使用 `getClient`。
- 阅读 [React 数据获取指南](./react-data-fetching.md) 了解详细的请求流程模式。

## 审查清单

- 没有将原生 `useEffect` 用于常规 React 逻辑
- 派生状态内联计算而非通过 effects 镜像
- 对象或数组依赖使用 equal hook 变体
- 记忆化解决的是真实的稳定性或性能需求
- 状态、上下文、渲染、请求和客户端辅助函数用于其特定目的
- 数据获取和测试遵循下方专门的指南

## 延伸阅读

- [React 数据获取指南](./react-data-fetching.md)
- [React 测试指南](./react-testing.md)
- [@faasjs/react](/doc/react/)
- [useEqualEffect](/doc/react/functions/useEqualEffect.html)
- [useEqualMemo](/doc/react/functions/useEqualMemo.html)
- [useEqualCallback](/doc/react/functions/useEqualCallback.html)
- [useEqualMemoize](/doc/react/functions/useEqualMemoize.html)
- [useConstant](/doc/react/functions/useConstant.html)
- [usePrevious](/doc/react/functions/usePrevious.html)
- [useStateRef](/doc/react/functions/useStateRef.html)
- [createSplittingContext](/doc/react/functions/createSplittingContext.html)
- [useSplittingState](/doc/react/functions/useSplittingState.html)
- [OptionalWrapper](/doc/react/functions/OptionalWrapper.html)
- [ErrorBoundary](/doc/react/classes/ErrorBoundary.html)
