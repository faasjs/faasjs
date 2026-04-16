# React 测试指南

当你在 FaasJS 项目中编写或评审会覆盖 FaasJS 请求流程的 React hooks 或组件测试时，请使用这份指南。

请先遵循共享的 [测试指南](./testing.md)，再使用下面这些 React 专项规则。

如果只是纯展示组件，或是不涉及 FaasJS 请求流程的 hooks，请优先使用共享的 [测试指南](./testing.md) 和 [React 指南](./react.md)。

## 适用场景

- 测试会发起 FaasJS 请求的 hooks
- 测试会触发 FaasJS 请求的组件
- 决定如何在请求相关 React 测试中使用 `setMock`
- 在 Vitest 中设置共享的请求 mock 清理
- 在 request flow 场景里选择 hook tests 与 component tests

## 默认工作流

1. 先从共享的 [测试指南](./testing.md) 开始。
2. 需要 `jsdom` 的 React hook 与组件测试，文件名使用 `.ui.test.ts` 或 `.ui.test.tsx`。
3. 在共享 Vitest setup 中使用 `afterEach(() => setMock(null))` 清除全局 mock。
4. 在每个测试或 `beforeEach` 中设置当前场景所需的具体 mock。
5. 能在请求层使用 `setMock` 时，优先不要去 mock 本地 hooks、函数或组件。
6. 测试可观察行为，而不是实现细节。
7. 当这些流程存在时，覆盖 loading、error、reload、skip、debounce 与 controlled-props 行为。
8. hook 行为使用 hook tests，界面可见行为使用 component tests。

## 规则

### 1. 使用 `setMock`，不要发真实网络请求

- 针对 `@faasjs/react` 请求流程的 React 单元测试，应使用 `setMock`。
- 不要在单元测试中依赖外部服务、真实 fetch 时序或环境相关后端。
- mock 设置应保持显式，并且局部化到具体测试场景。
- 当测试依赖 `@testing-library/react`、`renderHook`、`window` 或其他 `jsdom` API 时，使用 `.ui.test.ts` 或 `.ui.test.tsx` 后缀，让 Vitest 可以按文件名把它路由到 `jsdom` project，而不是依赖 package 位置。

Vitest setup 示例：

```ts
import { afterEach } from 'vitest'

import { setMock } from '@faasjs/react'

afterEach(() => {
  setMock(null)
})
```

### 2. 从最小可用 mock 开始

- 当一个响应就足够时，使用静态对象。
- 当响应依赖 path 或 params 时，使用 handler。
- 只有在被测代码真的会读取 stream 时，才使用 streaming mock。
- 对简单的文本流场景，优先使用 `stringToStream`，让测试设置保持紧凑。

基础示例：

```ts
import { setMock } from '@faasjs/react'

setMock({
  data: {
    name: 'FaasJS',
  },
})

setMock({
  status: 500,
  data: {
    message: 'Internal Server Error',
  },
})
```

Handler 示例：

```ts
import { setMock } from '@faasjs/react'

setMock(async () => ({
  data: {
    name: 'FaasJS',
  },
}))

setMock(async (path) => {
  if (path === '/pages/users/get') {
    return {
      data: {
        id: 1,
        name: 'FaasJS',
      },
    }
  }

  if (path === '/pages/posts/get') {
    return {
      data: {
        id: 2,
        title: 'Hello',
      },
    }
  }

  return {
    status: 404,
    data: {
      message: 'Not Found',
    },
  }
})

setMock(async (path, params) => {
  if (path === '/pages/users/get' && params.id === 1) {
    return {
      data: {
        id: 1,
        name: 'Admin',
      },
    }
  }

  if (path === '/pages/users/get' && params.id === 2) {
    return {
      data: {
        id: 2,
        name: 'Editor',
      },
    }
  }

  return {
    status: 404,
    data: {
      message: 'User not found',
    },
  }
})
```

Streaming 示例：

```ts
import { stringToStream } from '@faasjs/utils'
import { setMock } from '@faasjs/react'

setMock({
  body: stringToStream('hello world'),
})
```

### 3. 尽量把 mock 边界放在请求层

- 先遵循共享的 [测试指南](./testing.md) 中“不要无谓 mock”的规则。
- 当 React 请求行为可以通过 `setMock` 覆盖时，优先不要去 mock 本地 hooks、组件或 helpers。
- 除非清晰的外部边界确实要求隔离，否则让子组件与本地 helpers 保持真实实现。
- 使用 `setMock` 时，模拟的是请求契约，而不是重建组件内部实现。

### 4. 为可见行为添加聚焦组件测试

- 组件测试优先使用 `@testing-library/react`。
- 断言用户真正能看到或触发的行为。
- 当组件自己拥有请求流程时，覆盖 success 和 failure 状态。

示例：

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setMock, useFaas } from '@faasjs/react'

function UserName() {
  const { data } = useFaas<{ name: string }>('/pages/users/get', {})

  return <div>{data?.name}</div>
}

describe('UserName', () => {
  beforeEach(() => {
    setMock(async () => ({
      data: {
        name: 'FaasJS',
      },
    }))
  })

  it('renders mocked data', async () => {
    render(<UserName />)

    expect(await screen.findByText('FaasJS')).toBeDefined()
  })
})
```

### 5. 为 hook 行为添加聚焦 hook 测试

- 当无需渲染完整 UI 就能验证行为时，优先使用 `renderHook`。
- 根据场景覆盖 reload、skip、debounce、loading、error 与 controlled props 等行为。
- 当新增或修改了基于 mock 的请求逻辑时，应增加测试来证明预期的 `setMock` 交互路径。

示例：

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setMock, useFaas } from '@faasjs/react'

describe('useFaas', () => {
  beforeEach(() => {
    setMock(async (_path, params) => ({
      data: params,
    }))
  })

  it('supports reload with next params', async () => {
    const { result } = renderHook(() => useFaas<{ id: number }>('/pages/users/get', { id: 1 }))

    await waitFor(() => expect(result.current.data).toEqual({ id: 1 }))

    await result.current.reload({ id: 2 })

    await waitFor(() => expect(result.current.data).toEqual({ id: 2 }))
  })
})
```

## 评审清单

- 先满足共享的 [测试指南](./testing.md) 规则
- 需要 `jsdom` 的测试使用 `.ui.test.ts` 或 `.ui.test.tsx` 后缀
- 请求相关测试使用 `setMock`，而不是发真实网络请求
- 共享 Vitest setup 通过 `setMock(null)` 清理 mocks
- mocks 没有比当前场景需要的复杂度更高
- 可以的话，请求类测试把 mock 边界保持在 `setMock` 或其他显式外部边界上
- 组件通过可见行为进行测试
- 合适时，hooks 通过 `renderHook` 进行测试
- 测试覆盖了相关的 loading、error、reload、skip、debounce 或 controlled-props 流程

## 延伸阅读

- [测试指南](./testing.md)
- [React 指南](./react.md)
- [React 数据请求指南](./react-data-fetching.md)
- [setMock](/doc/react/functions/setMock.html)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
