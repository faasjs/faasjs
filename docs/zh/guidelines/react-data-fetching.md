# React 数据请求指南

适用于 React 中的 FaasJS 请求：`useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper`、`withFaasData`、客户端设置、加载、错误、重试、防抖、轮询和重新加载行为。

## 适用场景

- 以请求-响应语义将数据加载到组件中
- 将流式文本或分块输出加载到组件中
- 在 `useFaas`、`useFaasStream`、`faas`、`FaasDataWrapper` 和 `withFaasData` 之间做选择
- 使用 base URL 和错误处理配置 `FaasReactClient`
- 实现加载、刷新、错误和重试状态
- 在编写自定义副作用之前，决定何时使用 `skip`、`debounce`、`polling` 或 `reload`

## 默认工作流

1. 使用 `useFaas` 处理标准的、组件自有的请求状态。
2. 使用 `useFaasStream` 处理流式文本或分块输出。
3. 使用 `faas` 处理命令式事件处理请求。
4. 在编写自定义副作用或定时器之前，优先使用内置的 `skip`、`debounce`、`polling` 和 `reload(nextParams)`。
5. 仅在包装器组合有帮助时使用 `FaasDataWrapper` 或 `withFaasData`。
6. 在应用启动时一次性配置 `FaasReactClient`；仅在多客户端场景下使用 `getClient`。
7. 始终在面向用户的代码中处理加载、错误和重试状态。

## 规则

### 1. 标准请求使用 `useFaas`

```tsx
import { useFaas } from '@faasjs/react'

export function Profile(props: { id: number }) {
  const { data, error, loading, reload } = useFaas('/pages/users/detail', { id })

  if (loading) return <div>Loading...</div>
  if (error)
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={reload}>Retry</button>
      </div>
    )

  return <div>Name: {data?.name}</div>
}
```

- 将请求保持靠近渲染或拥有数据的组件。
- 显式处理 `loading`、`error` 和重试。
- 使用 `reload()` 保持相同参数，使用 `reload(nextParams)` 处理用户触发的参数变更。

### 2. 生命周期控制优于自定义副作用

```tsx
import { useFaas } from '@faasjs/react'

export function UserSearch() {
  const [keyword, setKeyword] = React.useState('')

  const { data, error, loading, reload } = useFaas(
    '/pages/users/search',
    { keyword },
    {
      skip: (params) => !params.keyword.trim(),
      debounce: 300,
    },
  )

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search users"
      />
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      <button onClick={() => reload({ keyword: 'admin' })}>Load admins</button>
      <ul>
        {data?.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

- 使用 `skip` 处理缺少参数或用户意图。
- 使用 `debounce` 处理搜索框和快速变化的筛选条件。
- 使用 `polling` 处理仪表板、队列和需要保持最新的列表。
- 使用 `reload(nextParams, { silent: true })` 在刷新时保持当前内容可见。
- 让 FaasJS 管理中止、重试、轮询和重新加载状态，而不是重新构建生命周期管道。

### 3. 轮询时保持旧数据可见

```tsx
import { useFaas } from '@faasjs/react'

export function PendingOrdersTable() {
  const { data, error, loading, refreshing } = useFaas(
    '/pages/orders/list',
    { status: 'pending' },
    {
      polling: 5000,
    },
  )

  if (loading && !data) return <div>Loading orders...</div>
  if (error) return <div>Failed to load: {error.message}</div>

  return (
    <div>
      {refreshing && <div>Refreshing...</div>}
      <table>
        {data?.items?.map((order: any) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
```

- 将 `loading` 视为首次加载或阻塞式重新加载状态。
- 将 `refreshing` 视为非阻塞的后台刷新状态。
- 当数据完整或缺少参数时，使用 `skip` 或 `polling: false` 停止轮询。
- 不要将 `refreshing` 连接到阻塞表格或页面旋转器。

### 4. 流式请求使用 `useFaasStream`

```tsx
import { useFaasStream } from '@faasjs/react'

export function Chat() {
  const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt: 'hello' })

  if (loading) return <div>Connecting...</div>
  if (error) return <button onClick={reload}>Retry</button>

  return <pre>{data}</pre>
}
```

- 用于聊天、日志、增量文本和分块负载。
- 在数据到达时渲染部分 `data`。
- 仍然需要处理 `loading`、`error` 和重试。

### 5. 命令式请求使用 `faas`

```tsx
import { useState } from 'react'
import { faas } from '@faasjs/react'

export function UserForm() {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (values: any) => {
    setSaving(true)
    setSubmitError(null)
    try {
      await faas('/pages/users/create', values)
      // 关闭浮层、刷新列表、显示成功信息
    } catch (error: any) {
      setSubmitError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <button disabled={saving} onClick={() => handleSubmit({ name: 'test' })}>
        {saving ? 'Saving...' : 'Submit'}
      </button>
      {submitError && <div>Error: {submitError}</div>}
    </div>
  )
}
```

- 用于事件处理、确认框、提交回调或一次性命令。
- 将变更操作与用户反馈以及有意的重新加载、关闭或失效步骤配对。
- 对于表单提交，在可用时优先使用 `Form.faas`。

### 6. 包装器用于组合边界

- 当包装器组合能简化现有树结构或渲染属性边界时，使用 `FaasDataWrapper`。
- 仅当 HOC 风格的导出是最清晰的集成点时使用 `withFaasData`。
- 不要仅仅为了避免编写一个使用 `useFaas` 的小组件而使用包装器。

使用渲染属性的包装器：

```tsx
import { FaasDataWrapper } from '@faasjs/react'

export function UserSummary(props: { id: number }) {
  return (
    <FaasDataWrapper
      action="/pages/users/detail"
      params={{ id: props.id }}
      fallback={<div>Loading...</div>}
      render={(data) => <div>{data?.name}</div>}
    />
  )
}
```

使用子组件模式的包装器：

```tsx
import { FaasDataWrapper } from '@faasjs/react'

function UserContent({ data }: { data: any }) {
  return <div>{data?.name}</div>
}

export function UserDetail(props: { id: number }) {
  return (
    <FaasDataWrapper action="/pages/users/detail" params={{ id: props.id }}>
      <UserContent />
    </FaasDataWrapper>
  )
}
```

### 7. HOC 风格集成

```tsx
import { withFaasData } from '@faasjs/react'

const UserDetail = withFaasData({
  action: '/pages/users/detail',
})(({ data }) => <div>{data?.name}</div>)
```

- 使用 `withFaasData` 处理旧式组件边界，或当导出格式要求使用 HOC 时。

### 8. 客户端设置保持集中化

```tsx
import { FaasReactClient } from '@faasjs/react'

FaasReactClient({
  baseUrl: '/api',
  onError: (error, action, params) => {
    console.error(`[${action}]`, error.message, params)
    // reportError(error)
  },
})
```

- 在应用启动附近一次性配置默认客户端。
- 使用 `onError` 进行集中式错误报告（例如集成 Sentry）。
- 不要在渲染函数或功能组件内部创建客户端。

### 9. 多客户端场景使用 `getClient`

```tsx
import { FaasReactClient, getClient } from '@faasjs/react'

// 默认客户端
FaasReactClient({ baseUrl: '/api' })
// 辅助客户端
FaasReactClient({ baseUrl: 'https://other-service.com' }, 'other')

const otherClient = getClient('other')
await otherClient('/external/endpoint', { key: 'value' })
```

- 仅在特殊的多客户端情况下使用 `getClient(host)`。
- 单客户端应用永远不需要 `getClient`。

## 审查清单

- 每个请求选择最匹配的 API：`useFaas`、`useFaasStream`、`faas`、包装器或 HOC
- 操作路径遵循文件约定并使用 `/pages/...` 映射
- 显式处理加载、错误、重试和非阻塞刷新状态
- 内置生命周期选项替代自定义副作用、定时器和临时的防抖逻辑
- 仅当结构上有益时才使用包装器风格组合
- 变更操作提供反馈，并有意识地刷新、关闭或使受影响的数据失效
- 客户端设置已集中化；`getClient` 仅用于多客户端场景
- 单客户端应用中不使用 `getClient`

## 延伸阅读

- [React 指南](./react.md)
- [React 测试指南](./react-testing.md)
- [@faasjs/react](/doc/react/)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
- [faas](/doc/react/functions/faas.html)
- [FaasDataWrapper](/doc/react/functions/FaasDataWrapper.html)
- [withFaasData](/doc/react/functions/withFaasData.html)
- [FaasReactClient](/doc/react/functions/FaasReactClient.html)
- [getClient](/doc/react/functions/getClient.html)
