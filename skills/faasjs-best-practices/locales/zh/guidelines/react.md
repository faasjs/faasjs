# React 指南

当你在 FaasJS 项目中创建或评审 React 页面、组件或 hooks 时，请使用这份指南。

## 适用场景

- 创建新的 React 页面、组件或 hook
- 评审 hook 的使用方式与依赖处理
- 判断 state 应该派生、memoize，还是同步
- 处理对象、数组或函数类型依赖
- 在原生 React hooks 与 `@faasjs/react` helpers 之间做选择

## 默认工作流

1. 保持 render 逻辑纯净，能内联派生的值就内联派生。
2. 用户触发的更新通过 event handlers 处理。
3. 避免使用原生 `useEffect`。
4. 当 side effect 真的不可避免时，使用 `useEqualEffect`。
5. 当 memoize 的值或回调依赖非原始值时，使用 `@faasjs/react` 的 equal hooks。
6. 只有在 state、context 或 rendering helpers 真能解决具体问题时，才使用它们。

## 规则

### 1. 默认避免使用 `useEffect`

- 不要把原生 `useEffect` 当成 React 逻辑的默认解法。
- 不要用 effect 从 props 或 state 派生渲染数据。
- 除非确实存在外部状态原因，否则不要用 effect 把 props 镜像到 state。
- 不要用 effect 触发那些本来可以直接放进 event handler 的逻辑。

优先这样写：

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

避免这样写：

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

### 2. 对 side effects 统一使用 `useEqualEffect`

- 在这个仓库里，副作用统一使用 `useEqualEffect`，不要用原生 `useEffect`。
- effect 的职责要保持窄，只做副作用相关事情。
- 当依赖里包含对象、数组或嵌套 params 时，这一点尤其重要。

示例：

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

### 3. 对非原始值依赖使用 equal memo hooks

- 对依赖较深的 memoized values，优先使用 `useEqualMemo`，不要用 `useMemo`。
- 对依赖较深的 callbacks，优先使用 `useEqualCallback`，不要用 `useCallback`。
- 当目标是稳定值，而不是缓存计算结果时，优先使用 `useEqualMemoize`。
- 如果依赖只有原始值，直接内联计算通常比任何 memo hook 都更简单。

`useEqualMemo` 示例：

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

`useEqualCallback` 示例：

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

`useEqualMemoize` 示例：

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

### 4. 只在 helper 真能解决特定问题时才用它们

- `useConstant` 适合“每个组件实例只创建一次”的值。
- 当比较当前 props / state 与上一次值能提升可读性时，使用 `usePrevious`。
- 当异步回调、timer 或 subscription 同时需要 React state 与一个永远指向最新值的 ref 时，使用 `useStateRef`。
- 除非真的需要这个 live ref，否则不要把普通 `useState` 全都替换成 `useStateRef`。

`useConstant` 示例：

```tsx
import { useConstant } from '@faasjs/react'

export function RequestId() {
  const requestId = useConstant(() => crypto.randomUUID())

  return <div>{requestId}</div>
}
```

`usePrevious` 示例：

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

`useStateRef` 示例：

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

### 5. 多字段共享状态使用 splitting context

- 当一个 context 对象里有多个会独立变化的字段时，使用 `createSplittingContext`。
- 它提供的 `Provider` 与 `use` helpers 能按 key 拆分读取，减少不必要的 rerender。
- 当你想从一个对象构建小型状态容器，并自动得到配套 setters 时，使用 `useSplittingState`。
- 对于复杂的本地状态共享场景，这个模式通常比把一个大而可变的对象直接塞进普通 context 更合适。

示例：

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

### 6. 使用 rendering helpers 简化组合边界

- 当同一份 children 有时需要包一层 wrapper、有时又需要直接渲染时，使用 `OptionalWrapper`。
- 对不稳定 widgets、远程内容区域或 feature islands 使用 `ErrorBoundary`，让局部失败不会拖垮整页。
- `ErrorBoundary` 的 fallback 保持简单、面向用户即可。

`OptionalWrapper` 示例：

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

`ErrorBoundary` 示例：

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

### 7. 显式做出数据请求与 client setup 选择

- 使用 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 和 `withFaasData` 时要有明确意图，不要随意混用。
- `FaasReactClient` 的配置应集中管理。
- `getClient` 只用于多个 Faas clients 这类特殊场景。
- 具体示例与权衡，请看专门的数据请求指南。

## 评审清单

- 原生 `useEffect` 没有被用作常规 React 逻辑的默认工具
- 派生状态通过内联计算获得，而不是通过 effect 镜像出来
- 对象或数组依赖使用 equal hook 变体处理
- 只有在确实解决稳定性或性能问题时才增加 memoization
- state 与 context helpers 是为了解决特定问题，而不是默认启用
- 数据请求与测试方式遵循下方专门指南

## 延伸阅读

- [React 数据请求指南](./react-data-fetching.md)
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
