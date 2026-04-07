# React 测试指南

当你在 FaasJS 项目中编写或评审 React hooks、组件与请求流程的单元测试时，请使用这份指南。

## 适用场景

- 测试来自 `@faasjs/react` 的 React hooks
- 测试会触发 FaasJS 请求的组件
- 决定如何使用 `setMock`
- 在 Vitest 中设置共享 mock 清理
- 在 hook tests 与 component tests 之间做选择

## 默认工作流

1. 在共享 Vitest setup 中使用 `afterEach(() => setMock(null))` 清除全局 mock。
2. 在每个测试或 `beforeEach` 中设置当前场景所需的具体 mock。
3. 测试可观察行为，而不是实现细节。
4. 当这些流程存在时，覆盖 loading、error、reload、skip、debounce 与 controlled-props 行为。
5. hook 行为使用 hook tests，界面可见行为使用 component tests。

## 规则

### 1. 使用 `setMock`，不要发真实网络请求

- 针对 `@faasjs/react` 请求流程的 React 单元测试，应使用 `setMock`。
- 不要在单元测试中依赖外部服务、真实 fetch 时序或环境相关后端。
- mock 设置应保持显式，并且局部化到具体测试场景。

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

### 3. 为可见行为添加聚焦组件测试

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

### 4. 为 hook 行为添加聚焦 hook 测试

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

- 请求相关测试使用 `setMock`，而不是发真实网络请求
- 共享 Vitest setup 通过 `setMock(null)` 清理 mocks
- mocks 没有比当前场景需要的复杂度更高
- 组件通过可见行为进行测试
- 合适时，hooks 通过 `renderHook` 进行测试
- 测试覆盖了相关的 loading、error、reload、skip、debounce 或 controlled-props 流程

## 延伸阅读

- [React 指南](./react.md)
- [React 数据请求指南](./react-data-fetching.md)
- [setMock](/doc/react/functions/setMock.html)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
