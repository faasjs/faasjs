# React 测试指南

在编写或审查涉及 FaasJS 请求流的 React 钩子或组件测试时，请使用本指南。

首先应用共享的 [测试指南](./testing.md)，然后使用下面的 React 特定规则。

对于不涉及 FaasJS 请求流的纯展示组件或钩子，请改用共享的 [测试指南](./testing.md) 和 [React 指南](./react.md)。

在本指南中，"UI 测试"指路由到 Vitest `ui` 项目且使用 `environment: 'jsdom'` 的测试。

## 适用场景

- 测试发起 FaasJS 请求的钩子
- 测试触发 FaasJS 请求的组件
- 决定如何在请求测试中使用 `setMock`
- 在 Vitest 中设置共享的模拟清理
- 在请求流场景中，在钩子测试和组件测试之间做选择

## 默认工作流

1. 从共享的 [测试指南](./testing.md) 开始。
2. 将 React 钩子和组件 UI 测试命名为 `.test.tsx`（当文件使用 TSX 时），或 `.ui.test.ts`（当测试不使用 TSX 语法时）。
3. 在共享的 Vitest 设置中使用 `afterEach(() => setMock(null))` 清理全局模拟。
4. 为每个测试或 `beforeEach` 设置特定的模拟。
5. 优先使用 `setMock` 这类请求层模拟，而不是模拟本地钩子、函数或组件。
6. 测试可观察行为，而非实现细节。
7. 在存在相应流程时，覆盖加载、错误、重新加载、跳过、防抖和受控属性行为。
8. 使用钩子测试测试钩子行为，使用组件测试测试可见的 UI 行为。

## 规则

### 1. 使用 `setMock` 而非真实网络请求

- 覆盖 `@faasjs/react` 请求流的 React 单元测试应使用 `setMock`。
- 不要在单元测试中依赖外部服务、真实的 fetch 时序或特定环境的后端。
- 保持模拟设置显式且局限于测试场景。
- 当测试使用 `@testing-library/react`、`renderHook`、`window` 或其他类似浏览器的 API 时，使用 `.test.tsx`（TSX 基础的 UI 测试）和 `.ui.test.ts`（非 TSX 的 UI 测试），以便 Vitest 可以将它们路由到 `ui` 项目，而无需依赖包位置。

Vitest 设置示例：

```ts
import { afterEach } from 'vitest'

import { setMock } from '@faasjs/react'

afterEach(() => {
  setMock(null)
})
```

### 2. 从适合场景的最小模拟开始

- 当一个响应就足够时，使用静态对象。
- 当响应取决于路径或参数时，使用处理函数。
- 仅当被测代码实际读取流时，才使用流式模拟。
- 优先使用 `stringToStream` 作为简单文本流场景的辅助工具，以保持测试设置简洁。

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

处理函数示例：

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

流式示例：

```ts
import { stringToStream } from '@faasjs/utils'
import { setMock } from '@faasjs/react'

setMock({
  body: stringToStream('hello world'),
})
```

### 3. 尽可能将模拟边界保持在请求层

- 遵循共享的 [测试指南](./testing.md) 中关于避免不必要模拟的规则。
- 当可以通过 `setMock` 来测试 React 请求行为时，优先于此方式，而非模拟本地钩子、组件或辅助函数。
- 保持子组件和本地辅助函数真实运行，除非清晰的外部边界强制隔离。
- 使用 `setMock` 来模拟请求契约，而非重现组件内部逻辑。

### 4. 针对可见行为编写聚焦的组件测试

- 组件测试优先使用 `@testing-library/react`。
- 断言用户能看到或触发的内容。
- 当组件拥有请求时，覆盖成功和失败状态。

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

### 5. 针对钩子行为编写聚焦的钩子测试

- 当行为可以在不渲染完整 UI 的情况下验证时，优先使用 `renderHook`。
- 在适用时覆盖重新加载、跳过、防抖、加载、错误和受控属性等行为。
- 当添加或更改基于模拟的请求逻辑时，包含证明预期 `setMock` 交互路径的测试。

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

## 审查清单

- 首先遵循共享的 [测试指南](./testing.md) 规则
- UI 测试中包含 TSX 时使用 `.test.tsx`，不包含时使用 `.ui.test.ts`
- 与请求相关的测试使用 `setMock` 而非真实网络调用
- 共享的 Vitest 设置使用 `setMock(null)` 清理模拟
- 模拟的复杂度不超过场景所需
- 请求测试尽可能将模拟边界保持在 `setMock` 或其他显式的外部边界处
- 组件通过可见行为进行测试
- 在适当时通过 `renderHook` 测试钩子
- 测试覆盖相关的加载、错误、重新加载、跳过、防抖或受控属性流程

## 延伸阅读

- [测试指南](./testing.md)
- [React 指南](./react.md)
- [React 数据请求指南](./react-data-fetching.md)
- [setMock](/doc/react/functions/setMock.html)
- [useFaas](/doc/react/functions/useFaas.html)
- [useFaasStream](/doc/react/functions/useFaasStream.html)
