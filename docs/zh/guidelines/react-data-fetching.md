# React 数据请求指南

当你在 React 组件中创建或评审 FaasJS 数据请求时，请使用这份指南。

## 适用场景

- 在 React 中请求常规 request-response 数据
- 在 React 中请求 streaming 响应
- 在 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 和 `withFaasData` 之间做选择
- 配置 `FaasReactClient`
- 处理请求的 loading、error 与 retry 状态
- 判断请求是否应该使用 `skip`、`debounce` 或 `reload(nextParams)`

## 默认工作流

1. 标准组件级请求使用 `useFaas`。
2. 流式文本或 chunked 输出使用 `useFaasStream`。
3. 事件处理器中的命令式请求使用 `faas`。
4. 在自己写请求副作用或定时器之前，先使用内建的 `skip`、`debounce` 与 `reload(nextParams)` 控制。
5. 只有在组合方式确实受益时，才使用 `FaasDataWrapper` 或 `withFaasData`。
6. 在应用初始化阶段统一配置一次 `FaasReactClient`。
7. 显式处理 loading、error 与 retry 状态。

## 规则

### 1. 标准请求使用 `useFaas`

- 当组件需要 `loading`、`data`、`error` 与 `reload` 时，`useFaas` 是默认选择。
- 让请求尽量靠近真正拥有或渲染这份数据的组件。
- 在面向用户的代码里，始终显式处理 error 与 retry 状态。

示例：

```tsx
import { useFaas } from '@faasjs/react'

export function Profile({ id }: { id: number }) {
  const { data, error, loading, reload } = useFaas('/pages/users/get', { id })

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div>
        <div>Load failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <span>{data.name}</span>
      <button type="button" onClick={() => reload()}>
        Refresh
      </button>
    </div>
  )
}
```

### 2. 先用内建请求生命周期控制，而不是自写 effect

- 当请求需要等待必要参数或用户动作时，优先使用 `skip` 或 `skip: (params) => ...`。
- 对搜索框、过滤器和其他高频变化输入，优先使用 `debounce`，不要手写 `setTimeout` 加 effect。
- 当用户操作需要立刻带新参数重刷请求时，使用 `reload(nextParams)`。
- 让 `useFaas` 和 `useFaasStream` 自己管理 abort、retry 与 reload 状态，而不是每个组件都重造一套请求生命周期。

示例：

```tsx
import { useFaas } from '@faasjs/react'

export function UserSearch({ keyword }: { keyword: string }) {
  const { data, loading, reload } = useFaas(
    '/pages/users/search',
    { keyword },
    {
      skip: (params) => !params.keyword.trim(),
      debounce: 300,
    },
  )

  return (
    <div>
      <button type="button" onClick={() => reload({ keyword: 'admin' })}>
        Load admins
      </button>
      {loading ? <div>Loading...</div> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

### 3. 流式响应使用 `useFaasStream`

- 聊天、日志、增量文本输出或其他 streaming payload 场景使用 `useFaasStream`。
- 要显式暴露 loading 与 error 状态。
- 渲染逻辑应尽量保持简单，让 streaming 行为更容易推理。

示例：

```tsx
import { useFaasStream } from '@faasjs/react'

export function Chat({ prompt }: { prompt: string }) {
  const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt })

  if (loading) return <div>Streaming...</div>

  if (error) {
    return (
      <div>
        <div>Stream failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return <pre>{data}</pre>
}
```

### 4. 命令式请求使用 `faas`

- 在事件处理器、提交处理器或其他命令式流程中使用 `faas`。
- 在本地组件中自行管理 pending 与 failure 状态。
- 不要只是为了发请求，就把一个事件驱动的提交流程硬改成 hook。

示例：

```tsx
import type { FormEvent } from 'react'
import { useState } from 'react'

import { faas } from '@faasjs/react'

export function UserForm({ id }: { id: number }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string>()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setSaving(true)
      setSubmitError(undefined)

      await faas('/pages/users/set', {
        id,
        name,
      })
    } catch (error: any) {
      setSubmitError(error.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
      {submitError ? <div>{submitError}</div> : null}
    </form>
  )
}
```

### 5. 只有 wrapper 组合更合适时才使用 `FaasDataWrapper`

- 当 render-prop 或 wrapper 组合比直接调用 `useFaas` 更适合页面结构时，再使用 `FaasDataWrapper`。
- 使用 `children` 时，`FaasDataWrapper` 会 clone 子元素，并注入 `data`、`error`、`reload` 等请求属性。
- 对新的函数组件，除非 wrapper 组合明显更简单，否则优先使用 `useFaas`。

使用 `render` 的 `FaasDataWrapper` 示例：

```tsx
import { FaasDataWrapper } from '@faasjs/react'

export function UserPanelWithRender({ id }: { id: number }) {
  return (
    <FaasDataWrapper
      action="/pages/users/get"
      params={{ id }}
      fallback={<div>Loading...</div>}
      render={({ data, error, reload }) =>
        error ? (
          <div>
            <div>Load failed: {error.message}</div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div>{data.name}</div>
        )
      }
    />
  )
}
```

使用 `children` 的 `FaasDataWrapper` 示例：

```tsx
import { FaasDataWrapper } from '@faasjs/react'

function UserContent(props: {
  data?: { name: string }
  error?: { message?: string } | null
  reload?(): Promise<any>
}) {
  if (props.error) {
    return (
      <div>
        <div>Load failed: {props.error.message}</div>
        <button type="button" onClick={() => props.reload?.()}>
          Retry
        </button>
      </div>
    )
  }

  return <div>{props.data?.name}</div>
}

export function UserPanelWithChildren({ id }: { id: number }) {
  return (
    <FaasDataWrapper action="/pages/users/get" params={{ id }} fallback={<div>Loading...</div>}>
      <UserContent />
    </FaasDataWrapper>
  )
}
```

### 6. 只有在 wrapper-style export 或固定集成边界时才使用 `withFaasData`

- 只有当 HOC 是最清晰的集成点时，才使用 `withFaasData`。
- 典型场景是 wrapper-style export，或一个你在本次改动中无法移除的既有组件边界。
- 对新代码，不要默认选择 HOC；当 `useFaas` 或 `FaasDataWrapper` 更简单时，就用它们。

示例：

```tsx
import { withFaasData } from '@faasjs/react'

export const UserName = withFaasData(
  ({ data, error, reload }) =>
    error ? (
      <button type="button" onClick={() => reload()}>
        Retry
      </button>
    ) : (
      <span>{data.name}</span>
    ),
  {
    action: '/pages/users/get',
    params: { id: 1 },
  },
)
```

### 7. 让 `FaasReactClient` 配置集中化

- 在应用初始化阶段创建并注册一次浏览器 client 配置。
- 使用 `onError` 在统一位置收集或上报请求错误。
- 不要在组件树深处到处创建临时 client。

示例：

```ts
import { FaasReactClient, ResponseError } from '@faasjs/react'

FaasReactClient({
  baseUrl: '/api/',
  onError: (action, params) => async (error) => {
    if (error instanceof ResponseError) {
      reportErrorToSentry(error, {
        tags: { action },
        extra: { params },
      })
    }
  },
})
```

### 8. `getClient` 只用于多 client 场景

- `getClient` 只适用于多个 Faas client 拥有不同 base URL 的特殊场景。
- 对普通的单 client 应用代码，不要动不动就使用 `getClient`。

示例：

```ts
import { FaasReactClient, getClient } from '@faasjs/react'

FaasReactClient({
  baseUrl: 'https://service-a.example.com/api/',
})

FaasReactClient({
  baseUrl: 'https://service-b.example.com/api/',
})

const client = getClient('https://service-b.example.com/api/')
```

## 评审清单

- 每个请求都选择了最小且最合适的 API：`useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 或 `withFaasData`
- 请求时机与条件控制优先使用内建的 `skip`、`debounce` 与 `reload(nextParams)`，而不是自写 effect 编排
- loading、error 与 retry 状态被显式处理
- action 路径遵循 file-conventions 指南，并使用 `/pages/...` 映射
- wrapper 风格的请求组合只在确实能改善结构时使用
- `FaasReactClient` 配置保持集中
- `getClient` 只用于特殊的多 client 场景

## 延伸阅读

- [React 指南](./react.md)
- [React 测试指南](./react-testing.md)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
- [faas](/doc/react/functions/faas.html)
- [FaasDataWrapper](/doc/react/variables/FaasDataWrapper.html)
- [withFaasData](/doc/react/functions/withFaasData.html)
- [FaasReactClient](/doc/react/functions/FaasReactClient.html)
- [getClient](/doc/react/functions/getClient.html)
