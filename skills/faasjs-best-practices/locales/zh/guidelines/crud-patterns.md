# CRUD Patterns 指南

当你在 FaasJS 应用中实现或评审标准 CRUD 功能（列表、详情、创建、更新、删除）时，请使用这份指南。它涵盖了从 API endpoint 到 React 页面的完整垂直切片。

更深层的规则请参考[应用切片指南](./application-slices.md)、[Ant Design 指南](./ant-design.md)、[defineApi 指南](./define-api.md)和 [React 数据请求指南](./react-data-fetching.md)。本指南聚焦于如何将这些模式组合成一个完整的 CRUD 周期。

## 默认工作流

1. 将业务字段建模为共享的 `items` metadata，放在 `use<Feature>Items` hook 中。
2. 创建五个 API 文件：`list`、`detail`、`create`、`update`、`remove`。
3. 使用 `Table.faasData` 构建列表页面，包含搜索/筛选控件和操作列。
4. 在抽屉中使用 `Description.faasData` 添加详情视图。
5. 添加创建/更新表单，复用相同的 `items`，并使用 `Form.faas`。
6. 使用模态确认弹窗添加删除功能。
7. 接入 mutation 反馈（`message.success`、`notification.error`）和表层刷新/关闭。
8. 使用 `testApi` 添加 API 测试，覆盖成功、校验和错误路径。
9. 使用 `setMock` 添加 React 测试，覆盖加载、渲染和 mutation 流程。

## 快速参考表

### API Endpoint 映射

| 操作 | API 文件            | 路由                               | 方法 | 参数                |
| ---- | ------------------- | ---------------------------------- | ---- | ------------------- |
| 列表 | `api/list.api.ts`   | `POST /pages/<feature>/api/list`   | post | 筛选条件、分页      |
| 详情 | `api/detail.api.ts` | `POST /pages/<feature>/api/detail` | post | `{ id }`            |
| 创建 | `api/create.api.ts` | `POST /pages/<feature>/api/create` | post | 业务字段            |
| 更新 | `api/update.api.ts` | `POST /pages/<feature>/api/update` | post | `{ id, ...fields }` |
| 删除 | `api/remove.api.ts` | `POST /pages/<feature>/api/remove` | post | `{ id }`            |

### 文件命名约定

| 层       | 约定                                      | 示例                                     |
| -------- | ----------------------------------------- | ---------------------------------------- |
| 页面入口 | `pages/<feature>/index.tsx`               | `pages/users/index.tsx`                  |
| 组件     | `pages/<feature>/components/*.tsx`        | `pages/users/components/UserTable.tsx`   |
| Hooks    | `pages/<feature>/hooks/*.ts`              | `pages/users/hooks/useUserItems.ts`      |
| APIs     | `pages/<feature>/api/*.api.ts`            | `pages/users/api/list.api.ts`            |
| API 测试 | `pages/<feature>/api/__tests__/*.test.ts` | `pages/users/api/__tests__/list.test.ts` |

## 共享 Items 模式

`items` 数组是 `Form`、`Table` 和 `Description` 中业务字段的唯一真实来源。每个 item 描述一个字段：其 id、标签、输入类型、校验规则以及可选的各表层专属渲染器。

将 items 定义在 `use<Feature>Items` hook 中，使其保持内聚且可复用。

```tsx
import { useConstant } from '@faasjs/react'
import type { FormItem, TableItem, DescriptionItem } from '@faasjs/ant-design'

export type UserField = {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

export function useUserItems() {
  return useConstant<Array<FormItem & TableItem & DescriptionItem>>(() => [
    {
      id: 'name',
      title: 'Name',
      required: true,
      rules: [{ min: 1, max: 100 }],
      tableRender: (value) => <a>{value}</a>,
    },
    {
      id: 'email',
      title: 'Email',
      required: true,
      rules: [{ type: 'email' }],
    },
    {
      id: 'role',
      title: 'Role',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      id: 'created_at',
      title: 'Created At',
      descriptionRender: (value) => new Date(value as string).toLocaleDateString(),
    },
  ])
}
```

**Items 规则：**

- 将 items 放在 `useConstant` 中，使数组引用在重渲染间保持稳定。
- 仅在展示形式确实因表层不同时才添加 `tableRender`、`descriptionRender` 或 `formRender`。
- 对于只出现在一个表层上的字段（如操作列），在消费组件中内联添加，不要污染共享 items。
- 对重复的自定义字段行为使用 `extendTypes`（参见 [Ant Design 指南](./ant-design.md#core-patterns)）。

## 列表页面模式

使用 `Table.faasData` 进行服务端驱动的列表请求。在表格上方添加一行搜索/筛选控件，以及用于详情/编辑/删除的操作列。

```tsx
import { Table, Title, useApp } from '@faasjs/ant-design'
import { Input, Button, Space } from 'antd'
import { useState } from 'react'

import { UserActions } from './components/UserActions'
import { useUserItems, type UserField } from './hooks/useUserItems'

export default function UsersPage() {
  const { setDrawerProps } = useApp()
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useState<{ keyword?: string }>({})

  const items = useUserItems()

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title>Users</Title>

      <Space>
        <Input.Search
          placeholder="Search by name or email"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => setSearchParams({ keyword: keyword || undefined })}
        />
        <Button
          type="primary"
          onClick={() =>
            setDrawerProps({
              open: true,
              title: 'Create User',
              width: 720,
              children: <UserForm onSuccess={() => reload()} />,
            })
          }
        >
          Create User
        </Button>
      </Space>

      <Table<UserField>
        rowKey="id"
        items={[
          ...items,
          {
            id: 'actions',
            title: 'Actions',
            tableRender: (_, row) => <UserActions row={row} onSuccess={() => reload()} />,
          },
        ]}
        faasData={{
          action: '/pages/users/api/list',
          params: searchParams,
        }}
      />
    </Space>
  )
}
```

### 列表 API

```ts
import { defineApi } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    keyword: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(20),
  }),
  async handler({ params }) {
    // Query database with params.keyword, params.page, params.pageSize
    return {
      rows: [
        {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
          role: 'admin',
          created_at: '2025-01-01',
        },
      ],
      total: 1,
    }
  },
})
```

### 搜索 / 筛选触发

- 使用 `setSearchParams` 触发 `Table.faasData` 重新请求。当 `faasData.params` 变化时，表格会自动重新请求。
- 通过 `useFaas` 生命周期使用 `debounce`，而非自定义定时器（参见 [React 数据请求指南](./react-data-fetching.md)）。
- 将 `keyword` 保持为输入框的本地状态，仅在提交搜索时推入 `searchParams`。

## 详情模式

使用 `Description.faasData` 进行详情请求。在抽屉中打开以保持列表上下文可见。

```tsx
import { Description, useApp } from '@faasjs/ant-design'

import { useUserItems, type UserField } from '../hooks/useUserItems'

export function UserDetail(props: { id: number }) {
  const items = useUserItems()

  return (
    <Description<UserField>
      items={items}
      faasData={{
        action: '/pages/users/api/detail',
        params: { id: props.id },
      }}
    />
  )
}
```

### 详情 API

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // Fetch from database by params.id
    const user = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
      created_at: '2025-01-01',
    }

    if (!user) {
      throw new HttpError({ statusCode: 404, message: 'User not found' })
    }

    return user
  },
})
```

**详情规则：**

- 复用 `use<Feature>Items` 中相同的 `items`。
- 对于详情中不同的字段，在 item 上使用 `descriptionRender`。
- 保持详情 API 响应结构与 item 字段 id 对齐。

## 创建表单模式

使用 `Form.faas` 进行表单提交，内置加载、校验、反馈和错误处理。

```tsx
import { Form, useApp } from '@faasjs/ant-design'

import { useUserItems } from '../hooks/useUserItems'

export function UserForm(props: { onSuccess?: () => void }) {
  const { message, notification, setDrawerProps } = useApp()
  const items = useUserItems()

  return (
    <Form
      items={items}
      faas={{
        action: '/pages/users/api/create',
        onSuccess: () => {
          message.success('User created')
          setDrawerProps({ open: false })
          props.onSuccess?.()
        },
        onError: (error) =>
          notification.error({
            message: 'Create failed',
            description: error?.message,
          }),
      }}
    />
  )
}
```

### 创建 API

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    role: z.enum(['admin', 'editor', 'viewer']),
  }),
  async handler({ params }) {
    // Check for duplicates
    if (/* email already exists */) {
      throw new HttpError({ statusCode: 409, message: 'Email already exists' })
    }

    // Insert into database and return created record
    return {
      id: 1,
      name: params.name,
      email: params.email,
      role: params.role,
      created_at: new Date().toISOString(),
    }
  },
})
```

**创建表单规则：**

- `Form.faas` 会自动处理按钮加载、校验和错误反馈。
- 成功反馈使用 `message.success`，失败反馈使用 `notification.error`。
- 成功后通过 `setDrawerProps({ open: false })` 关闭抽屉/弹窗。
- 调用 `props.onSuccess?.()` 以便父组件刷新列表。

## 更新表单模式

复用同一个 `UserForm` 组件，通过传入 `initialValues` 并切换 API action 实现。表单通过详情请求预填数据。

```tsx
import { Form, useApp } from '@faasjs/ant-design'

import { useUserItems } from '../hooks/useUserItems'

export function UserForm(props: {
  id?: number
  initialValues?: Record<string, any>
  onSuccess?: () => void
}) {
  const { message, notification, setDrawerProps } = useApp()
  const items = useUserItems()

  return (
    <Form
      initialValues={props.initialValues}
      items={items}
      faas={{
        action: props.id ? '/pages/users/api/update' : '/pages/users/api/create',
        params: (values) => ({ ...values, ...(props.id ? { id: props.id } : {}) }),
        onSuccess: () => {
          message.success(props.id ? 'User updated' : 'User created')
          setDrawerProps({ open: false })
          props.onSuccess?.()
        },
        onError: (error) =>
          notification.error({
            message: props.id ? 'Update failed' : 'Create failed',
            description: error?.message,
          }),
      }}
    />
  )
}
```

### 更新 API

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['admin', 'editor', 'viewer']).optional(),
  }),
  async handler({ params }) {
    const existing = { id: 1 } // Fetch from database

    if (!existing) {
      throw new HttpError({ statusCode: 404, message: 'User not found' })
    }

    // Update database where id = params.id
    return { id: params.id, ...params }
  },
})
```

**更新表单规则：**

- 对创建和更新使用同一个 `UserForm` 组件——`id` 属性决定模式。
- 在打开抽屉的页面/组件中获取当前值，然后作为 `initialValues` 传入。
- 将更新 API 字段设为可选（`z.string().optional()`），以支持部分更新。
- 使用 `Form.faas` 的 `params` 函数根据更新操作有条件地包含 `id`。

## 删除模式

对破坏性操作使用模态确认弹窗。在 `onOk` 处理程序中命令式调用 `faas`。

```tsx
import { Button, Space } from 'antd'
import { faas, useApp } from '@faasjs/ant-design'

export function UserActions(props: { row: { id: number }; onSuccess?: () => void }) {
  const { message, notification, setModalProps } = useApp()

  const handleDelete = () => {
    setModalProps({
      open: true,
      title: 'Delete User',
      children: 'Are you sure you want to delete this user? This action cannot be undone.',
      onOk: async () => {
        try {
          await faas('/pages/users/api/remove', { id: props.row.id })
          message.success('User deleted')
          setModalProps({ open: false })
          props.onSuccess?.()
        } catch (error: any) {
          notification.error({
            message: 'Delete failed',
            description: error?.message,
          })
        }
      },
    })
  }

  const handleEdit = () => {
    // Open drawer with UserForm and initialValues from props.row
  }

  const handleDetail = () => {
    // Open drawer with UserDetail
  }

  return (
    <Space>
      <Button type="link" onClick={handleDetail}>
        Detail
      </Button>
      <Button type="link" onClick={handleEdit}>
        Edit
      </Button>
      <Button type="link" danger onClick={handleDelete}>
        Delete
      </Button>
    </Space>
  )
}
```

### 删除 API

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    const existing = { id: 1 } // Fetch from database

    if (!existing) {
      throw new HttpError({ statusCode: 404, message: 'User not found' })
    }

    // Delete from database where id = params.id
    return { success: true }
  },
})
```

**删除规则：**

- 使用 `useApp()` 中的 `setModalProps` 进行模态确认。
- 在 `onOk` 处理程序内部命令式调用 `faas`——而不是 `Form.faas`。
- 始终先获取记录，未找到时返回 `404`。
- 成功后关闭弹窗，显示 `message.success`，并调用 `onSuccess` 刷新父组件。

## 完整 CRUD 切片布局参考

### 目录结构

```
src/pages/users/
  index.tsx                          # 页面入口：组合 UserTable、创建按钮
  components/
    UserTable.tsx                    # 带 faasData、搜索、操作列的表格
    UserForm.tsx                     # 创建/更新表单（id 属性切换模式）
    UserDetail.tsx                   # 带 faasData 的 Description
    UserActions.tsx                  # 详情 / 编辑 / 删除按钮
  hooks/
    useUserItems.ts                  # 共享 items metadata
  api/
    list.api.ts                      # POST /pages/users/api/list
    detail.api.ts                    # POST /pages/users/api/detail
    create.api.ts                    # POST /pages/users/api/create
    update.api.ts                    # POST /pages/users/api/update
    remove.api.ts                    # POST /pages/users/api/remove
    __tests__/
      list.test.ts                   # list 的 testApi
      detail.test.ts                 # detail 的 testApi
      create.test.ts                 # create 的 testApi
      update.test.ts                 # update 的 testApi
      remove.test.ts                 # remove 的 testApi
```

### 文件数量与职责

| 文件              | 行数（约） | 职责                         |
| ----------------- | ---------- | ---------------------------- |
| `index.tsx`       | 30-60      | 页面入口、布局、组合组件     |
| `UserTable.tsx`   | 40-80      | 表格、搜索、筛选、操作列     |
| `UserForm.tsx`    | 30-60      | 表单项、faas 配置、反馈      |
| `UserDetail.tsx`  | 15-30      | 带 faasData 的 Description   |
| `UserActions.tsx` | 40-70      | 详情/编辑/删除按钮、模态确认 |
| `useUserItems.ts` | 30-60      | 共享 items metadata          |
| 每个 `.api.ts`    | 15-40      | Schema、handler、DB 查询     |
| 每个 API 测试     | 20-50      | testApi、成功/错误路径       |

## 测试 CRUD Endpoint

使用 `@faasjs/dev` 中的 `testApi` 测试每个 endpoint。覆盖成功、校验失败和预期的业务错误。

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import createApi from '../create.api'
import listApi from '../list.api'
import detailApi from '../detail.api'
import updateApi from '../update.api'
import removeApi from '../remove.api'

describe('users/api/create', () => {
  const handler = testApi(createApi)

  it('creates a user with valid params', async () => {
    const response = await handler({
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
    })

    expect(response.statusCode).toBe(200)
    expect(response.data?.name).toBe('Alice')
    expect(response.data?.id).toBeGreaterThan(0)
  })

  it('returns 400 when email is invalid', async () => {
    const response = await handler({
      name: 'Alice',
      email: 'not-an-email',
      role: 'admin',
    })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('returns 409 when email already exists', async () => {
    const response = await handler({
      name: 'Alice',
      email: 'existing@example.com',
      role: 'admin',
    })

    expect(response.statusCode).toBe(409)
    expect(response.error?.message).toBe('Email already exists')
  })
})

describe('users/api/list', () => {
  const handler = testApi(listApi)

  it('returns paginated results', async () => {
    const response = await handler({ page: 1, pageSize: 20 })

    expect(response.statusCode).toBe(200)
    expect(response.data?.rows).toBeDefined()
    expect(response.data?.total).toBeDefined()
    expect(Array.isArray(response.data?.rows)).toBe(true)
  })

  it('filters by keyword', async () => {
    const response = await handler({ keyword: 'Alice', page: 1, pageSize: 20 })

    expect(response.statusCode).toBe(200)
    expect(response.data?.rows).toBeDefined()
  })
})

describe('users/api/detail', () => {
  const handler = testApi(detailApi)

  it('returns user detail', async () => {
    const response = await handler({ id: 1 })

    expect(response.statusCode).toBe(200)
    expect(response.data?.id).toBe(1)
  })

  it('returns 404 for non-existent user', async () => {
    const response = await handler({ id: 999 })

    expect(response.statusCode).toBe(404)
    expect(response.error?.message).toBe('User not found')
  })
})

describe('users/api/update', () => {
  const handler = testApi(updateApi)

  it('updates a user', async () => {
    const response = await handler({ id: 1, name: 'Alice Updated' })

    expect(response.statusCode).toBe(200)
  })

  it('returns 404 for non-existent user', async () => {
    const response = await handler({ id: 999, name: 'Ghost' })

    expect(response.statusCode).toBe(404)
  })
})

describe('users/api/remove', () => {
  const handler = testApi(removeApi)

  it('deletes a user', async () => {
    const response = await handler({ id: 1 })

    expect(response.statusCode).toBe(200)
  })

  it('returns 404 for non-existent user', async () => {
    const response = await handler({ id: 999 })

    expect(response.statusCode).toBe(404)
  })
})
```

**CRUD 测试规则：**

- 遵循共享的[测试指南](./testing.md)和 [defineApi 指南](./define-api.md)。
- 对每个 endpoint 测试：成功路径、校验失败（400）和业务错误（404、409）。
- 使用 `testApi(api)` 获取类型化的 handler。
- 同时断言 `statusCode` 和 `data`/`error` 的结构。
- 将测试放在 API 文件旁边的 `api/__tests__/` 下。

## Agent 效率技巧

以下模式可帮助 AI coding agent 以 2-3 倍速度生成完整的 CRUD 功能。

### 1. 从 items 开始

```text
Prompt: "Create a `useProductItems` hook with fields: name (required), price (required, positive number), category (select with 3 options), description (textarea), status (select). Store in pages/products/hooks/useProductItems.ts"
```

Items 是基础。一旦 items 存在，agent 就能一致地推导出 `Table`、`Form` 和 `Description`。

### 2. 一次性生成五个 API

```text
Prompt: "Create 5 API files for products CRUD under pages/products/api/: list, detail, create, update, remove. Follow the defineApi guide. Each should have a Zod schema and handler."
```

五个小的 `.api.ts` 文件一起生成比逐个生成更快，而且 agent 可以保持 schema 的一致性。

### 3. 复制粘贴组合表单

带有 `id` 模式切换（创建 vs 更新）的 `UserForm` 模式是可复用的。生成一个组合表单，而不是分开的创建/更新组件。

### 4. 一次性生成列表 + 抽屉连线

```text
Prompt: "Create pages/products/index.tsx with a Table.faasData list, search button, create button that opens a drawer with ProductForm, and an actions column with detail/edit/delete. Use the shared items from useProductItems."
```

一个提示覆盖了页面入口、表格、抽屉连线和操作列。

### 5. 批量 API 测试

```text
Prompt: "Create test files for all 5 product APIs under pages/products/api/__tests__/. Each test should cover success and 400/404/409 paths where applicable."
```

一个提示以一致的模式生成所有测试。

### 6. 对新功能使用切片模板

当开始一个新的 CRUD 功能时，先创建完整的目录结构：

```text
Prompt: "Create a full CRUD slice for orders under pages/orders/. Include: index.tsx, components/ (OrderTable, OrderForm, OrderDetail, OrderActions), hooks/useOrderItems, api/ (list, detail, create, update, remove), and api/__tests__/ for all 5 endpoints."
```

## 规则

1. 使用共享的 `items`（放在 `use<Feature>Items` hook 中）作为 `Form`、`Table` 和 `Description` 中业务字段的唯一真实来源。
2. 使用 CRUD 操作名（`list`、`detail`、`create`、`update`、`remove`）命名 API 文件，并放在 `<feature>/api/` 下。
3. 创建/更新提交使用 `Form.faas`——它会自动处理加载、校验和错误反馈。
4. 列表请求使用 `Table.faasData`——它会自动处理加载、错误和参数变化时的重新请求。
5. 详情请求使用 `Description.faasData`。
6. 使用组合的 `UserForm` 组件，通过 `id` 属性在创建和更新模式之间切换。
7. 删除和其他一次性 mutation 使用命令式 `faas`。
8. 每次 mutation 后关闭覆盖层并刷新受影响的表层。
9. 成功反馈使用 `message.success`，失败反馈使用 `notification.error`。
10. 在 detail、update 和 remove endpoint 中始终先获取资源，未找到时返回 `404`。
11. 在 create/update endpoint 中检查重复，冲突时返回 `409`。
12. 将 API 测试放在 `api/__tests__/` 下，使用 `@faasjs/dev` 的 `testApi`。
13. 将 `items` 放在 `useConstant` 中，使数组引用在重渲染间保持稳定。
14. 操作列在 `Table` items 中内联添加，而不是在共享 items 中。
15. 使用 `useApp()` 中的 `setDrawerProps` 进行上下文内的创建/编辑/详情覆盖层。
16. 使用 `useApp()` 中的 `setModalProps` 进行破坏性确认弹窗。

## 评审清单

- [ ] 存在共享的 `use<Feature>Items` hook，包含所有业务字段
- [ ] 存在五个 API 文件：`list.api.ts`、`detail.api.ts`、`create.api.ts`、`update.api.ts`、`remove.api.ts`
- [ ] 每个 API 在 `defineApi` 中内联定义了 Zod schema
- [ ] 列表 API 返回 `{ rows, total }` 结构
- [ ] 详情/更新/删除 API 检查存在性，未找到时返回 `404`
- [ ] 创建/更新 API 检查重复，冲突时返回 `409`
- [ ] `Table.faasData` 驱动列表，带搜索/筛选参数
- [ ] `Description.faasData` 驱动详情视图
- [ ] `Form.faas` 驱动创建/更新，带基于 `id` 的模式切换
- [ ] `faas` + 模态确认弹窗驱动删除
- [ ] Mutation 提供反馈（`message.success`、`notification.error`）
- [ ] Mutation 关闭覆盖层并调用 `onSuccess` 刷新父组件
- [ ] API 测试覆盖成功路径、400（校验）和业务错误（404/409）
- [ ] API 测试使用 `testApi` 并放在 `api/__tests__/` 下
- [ ] Items 包裹在 `useConstant` 中
- [ ] 操作列在 `Table` 中内联添加，而不是在共享 items 中
- [ ] 创建/编辑/详情使用抽屉；删除确认使用模态弹窗
- [ ] 文件结构遵循 `pages/<feature>/{components/,hooks/,api/}` 约定
