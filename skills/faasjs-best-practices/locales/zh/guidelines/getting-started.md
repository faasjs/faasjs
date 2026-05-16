# 快速开始指南

当你要启动一个新的 FaasJS 项目，或让新开发者加入现有 FaasJS 代码库时，请使用这份指南。它涵盖了完整的搭建流程、第一个功能以及日常开发工作流，让人类和 AI coding agent 都能快速上手。

FaasJS 是一个受 Rails 启发的精选式全栈 TypeScript 框架，面向数据库驱动的 React 业务应用。它提供一条大厨精选式主路径，而不是让每个团队从零拼装自己的框架。

## 前提条件

开始之前，请确保你的环境满足以下要求：

- **Node.js** >= 24.x — FaasJS 依赖现代 Node 特性，包括原生 TypeScript 模块加载。
- **npm** >= 9.x — 用于依赖管理和项目脚手架。
- **PostgreSQL** >= 14.x — FaasJS 使用 PostgreSQL 作为关系型数据存储（通过 `@faasjs/pg`）。数据库功能和集成测试需要一个运行中的本地实例或 Docker 容器。
- **基础 TypeScript 知识** — FaasJS 以 TypeScript 为先。你需要熟悉类型、接口和模块导入。

验证你的环境：

```bash
node --version   # >= 24.x
npm --version    # >= 9.x
psql --version   # >= 14.x
```

## 创建新项目

最快的方式是使用 `create-faas-app`。

### 第 1 步：搭建项目脚手架

```bash
npx create-faas-app --name my-app
```

这条命令会：

1. 创建 `my-app/` 目录
2. 安装所有依赖（`npm install`）
3. 运行初始测试套件验证搭建是否成功

### 第 2 步：选择模板

`create-faas-app` 提供两种模板：

| 模板            | 描述                                                                                                 | 适用场景                                         |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `admin`（默认） | 完整管理后台 starter，包含 React、Ant Design 页面、PostgreSQL 集成和一个可直接复用的 users CRUD 切片 | 后台管理系统、内部工具、SaaS dashboard、管理面板 |
| `minimal`       | 更轻量的 starter，包含 React 和最简配置                                                              | 简单 API、BFF 层，或希望从零构建 UI 的场景       |

使用特定模板：

```bash
npx create-faas-app --name my-app --template minimal
```

### 第 3 步：进入项目目录

```bash
cd my-app
```

项目已准备就绪。如果你选择了 `admin` 模板，初始测试套件在脚手架搭建时已经运行过。你也可以手动运行：

```bash
npm test
```

有关可用命令，请参见 [CLI and Tooling 指南](./cli-and-tooling.md)。

## 项目结构概览

搭建完成的 FaasJS 项目遵循一致的布局。以下是你会看到的内容：

```
my-app/
  src/
    faas.yaml              # 运行时配置（服务根路径、plugins、环境覆盖）
    .faasjs/
      types.d.ts           # 自动生成的 API 类型声明
    pages/                 # 前端页面和后端 API 路由
      index.tsx            # 应用入口页面
      users/               # 示例功能：users CRUD
        index.tsx          # 页面入口
        api/
          list.api.ts       # POST /pages/users/api/list
          create.api.ts     # POST /pages/users/api/create
          detail.api.ts     # POST /pages/users/api/detail
          update.api.ts     # POST /pages/users/api/update
          remove.api.ts     # POST /pages/users/api/remove
          __tests__/        # API 测试
    types/
      faasjs-pg.d.ts       # PostgreSQL 表类型声明（声明合并到 `Tables`）
  migrations/              # 数据库迁移文件（时间戳命名）
    20250101000000_create_users.ts
  faas.yaml                #（可选）根级配置覆盖
  tsconfig.json            # TypeScript 配置
  vite.config.ts           # Vite + Vitest 配置
  package.json
```

### 关键目录

| 目录          | 用途                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/`  | 前端页面作为 React 组件，后端 API 路由作为 `.api.ts` 文件。每个功能拥有独立的子目录，包含 `components/`、`hooks/` 和 `api/` 子文件夹。 |
| `src/types/`  | 类型声明文件，包括 `@faasjs/pg` 表类型增强。                                                                                           |
| `migrations/` | 时间戳命名的数据库迁移文件。通过 `faasjs-pg` CLI 创建和管理。                                                                          |

### 关键配置文件

| 文件             | 用途                                                  | 参考                                               |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------- |
| `src/faas.yaml`  | 运行时配置：服务根路径、base path、环境覆盖、plugins  | [faas.yaml 规范](../locales/en/specs/faas-yaml.md) |
| `tsconfig.json`  | TypeScript 配置，继承 `@faasjs/types/tsconfig/*` 预设 | [项目配置指南](./project-config.md)                |
| `vite.config.ts` | Vite/Vitest 配置，使用 `@faasjs/dev` 的 `viteConfig`  | [项目配置指南](./project-config.md)                |

### 零映射路由

API 路由直接映射到 `src/` 下的文件路径。无需路由注册表。

| 文件                                | 路由                        |
| ----------------------------------- | --------------------------- |
| `src/pages/todo/api/list.api.ts`    | `POST /pages/todo/api/list` |
| `src/pages/todo/api/index.api.ts`   | `POST /pages/todo/api`      |
| `src/pages/todo/api/default.api.ts` | `/pages/todo/*` 的 fallback |

完整的路由解析顺序请参见[路由映射规范](../locales/en/specs/routing-mapping.md)。

## 你的第一个功能

本节将带领你完成一个完整的端到端 CRUD 功能：一个包含 PostgreSQL 表、五个 API endpoint、一个 React 前端页面和测试的 Todo 列表。

### 第 1 步：创建迁移

为 `todos` 表创建一个新的迁移文件：

```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new create_todos
```

这会创建一个类似 `migrations/20250101000001_create_todos.ts` 的文件。打开它并定义表结构：

```ts
import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.createTable('todos', (table) => {
    table.number('id').primary()
    table.string('title')
    table.text('description').nullable()
    table.boolean('completed').defaultTo(false)
    table.timestamps()
    table.index('title')
  })
}

export function down(builder: SchemaBuilder) {
  builder.dropTable('todos')
}
```

运行迁移：

```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
```

迁移编写规则请参见 [PG Schema 与迁移指南](./pg-schema-and-migrations.md)。

### 第 2 步：更新表类型声明

在 `src/types/faasjs-pg.d.ts` 中添加 `todos` 表类型：

```ts
import '@faasjs/pg'

declare module '@faasjs/pg' {
  interface Tables {
    todos: {
      id: number
      title: string
      description: string | null
      completed: boolean
      created_at: string
      updated_at: string
    }
  }
}
```

声明合并规则请参见 [PG 表类型指南](./pg-table-types.md)。

### 第 3 步：创建 API endpoints

在 `src/pages/todos/api/` 下创建五个 API 文件。它们遵循 [CRUD Patterns 指南](./crud-patterns.md)。

#### `src/pages/todos/api/list.api.ts`

```ts
import { defineApi } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    keyword: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(20),
  }),
  async handler({ params }) {
    // TODO: 使用 params.keyword、params.page、params.pageSize 查询数据库
    return {
      rows: [
        {
          id: 1,
          title: 'Learn FaasJS',
          description: 'Build a Todo app',
          completed: false,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
      total: 1,
    }
  },
})
```

#### `src/pages/todos/api/create.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
  }),
  async handler({ params }) {
    // TODO: 插入数据库并返回创建记录
    return {
      id: 1,
      title: params.title,
      description: params.description || null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
})
```

#### `src/pages/todos/api/detail.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // TODO: 通过 params.id 从数据库获取
    const todo = {
      id: 1,
      title: 'Learn FaasJS',
      description: 'Build a Todo app',
      completed: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    }

    if (!todo) {
      throw new HttpError({ statusCode: 404, message: 'Todo not found' })
    }

    return todo
  },
})
```

#### `src/pages/todos/api/update.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  async handler({ params }) {
    // TODO: 获取现有 todo，更新并返回
    return { id: params.id, ...params }
  },
})
```

#### `src/pages/todos/api/remove.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // TODO: 从数据库删除 where id = params.id
    return { success: true }
  },
})
```

有关 schema 校验和错误处理规则，请参见 [defineApi 指南](./define-api.md)。

### 第 4 步：创建前端页面

创建一个共享的 items hook，以及包含表格、创建表单和详情视图的页面。

#### `src/pages/todos/hooks/useTodoItems.ts`

```tsx
import { useConstant } from '@faasjs/react'
import type { FormItem, TableItem, DescriptionItem } from '@faasjs/ant-design'

export type TodoField = {
  id: number
  title: string
  description: string | null
  completed: boolean
  created_at: string
  updated_at: string
}

export function useTodoItems() {
  return useConstant<Array<FormItem & TableItem & DescriptionItem>>(() => [
    {
      id: 'title',
      title: 'Title',
      required: true,
      rules: [{ min: 1, max: 200 }],
    },
    {
      id: 'description',
      title: 'Description',
      type: 'textarea',
    },
    {
      id: 'completed',
      title: 'Completed',
      type: 'switch',
      tableRender: (value) => (value ? 'Yes' : 'No'),
    },
    {
      id: 'created_at',
      title: 'Created At',
      descriptionRender: (value) => new Date(value as string).toLocaleDateString(),
    },
  ])
}
```

#### `src/pages/todos/index.tsx`

```tsx
import { Table, Title, useApp, Form, Description, faas } from '@faasjs/ant-design'
import { Button, Space, Input, Modal } from 'antd'
import { useState } from 'react'

import { useTodoItems, type TodoField } from './hooks/useTodoItems'

export default function TodosPage() {
  const { message, notification, setDrawerProps, setModalProps } = useApp()
  const [keyword, setKeyword] = useState('')
  const [searchParams, setSearchParams] = useState<{ keyword?: string }>({})

  const items = useTodoItems()

  const handleDelete = (id: number, onSuccess: () => void) => {
    setModalProps({
      open: true,
      title: 'Delete Todo',
      children: 'Are you sure?',
      onOk: async () => {
        try {
          await faas('/pages/todos/api/remove', { id })
          message.success('Todo deleted')
          setModalProps({ open: false })
          onSuccess()
        } catch (error: any) {
          notification.error({ message: 'Delete failed', description: error?.message })
        }
      },
    })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title>Todo List</Title>

      <Space>
        <Input.Search
          placeholder="Search by title"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => setSearchParams({ keyword: keyword || undefined })}
        />
        <Button
          type="primary"
          onClick={() =>
            setDrawerProps({
              open: true,
              title: 'Create Todo',
              width: 480,
              children: (
                <Form
                  items={items}
                  faas={{
                    action: '/pages/todos/api/create',
                    onSuccess: () => {
                      message.success('Todo created')
                      setDrawerProps({ open: false })
                      reload()
                    },
                    onError: (error) =>
                      notification.error({ message: 'Create failed', description: error?.message }),
                  }}
                />
              ),
            })
          }
        >
          Create Todo
        </Button>
      </Space>

      <Table<TodoField>
        rowKey="id"
        items={[
          ...items,
          {
            id: 'actions',
            title: 'Actions',
            tableRender: (_, row) => (
              <Space>
                <Button
                  type="link"
                  onClick={() =>
                    setDrawerProps({
                      open: true,
                      title: 'Todo Detail',
                      width: 480,
                      children: (
                        <Description<TodoField>
                          items={items}
                          faasData={{ action: '/pages/todos/api/detail', params: { id: row.id } }}
                        />
                      ),
                    })
                  }
                >
                  Detail
                </Button>
                <Button
                  type="link"
                  onClick={() =>
                    setDrawerProps({
                      open: true,
                      title: 'Edit Todo',
                      width: 480,
                      children: (
                        <Form
                          initialValues={row}
                          items={items}
                          faas={{
                            action: '/pages/todos/api/update',
                            params: (values) => ({ ...values, id: row.id }),
                            onSuccess: () => {
                              message.success('Todo updated')
                              setDrawerProps({ open: false })
                              reload()
                            },
                            onError: (error) =>
                              notification.error({
                                message: 'Update failed',
                                description: error?.message,
                              }),
                          }}
                        />
                      ),
                    })
                  }
                >
                  Edit
                </Button>
                <Button type="link" danger onClick={() => handleDelete(row.id, reload)}>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
        faasData={{
          action: '/pages/todos/api/list',
          params: searchParams,
        }}
      />
    </Space>
  )
}
```

> 上面的 `reload()` 是表格的 reload 函数。在实际组件中，你需要通过 `Table.faasData` 的 render-prop 或 ref 模式获取它。完整的模式请参见 [CRUD Patterns 指南](./crud-patterns.md) 和 [Ant Design 指南](./ant-design.md)。

页面布局和组件模式请参见 [Ant Design 指南](./ant-design.md)，`useFaas`、`faas` 及生命周期选项请参见 [React 数据请求指南](./react-data-fetching.md)。

### 第 5 步：添加测试

在 `src/pages/todos/api/__tests__/` 下创建 API 测试。每个测试使用 `@faasjs/dev` 的 `testApi`。

```ts
// src/pages/todos/api/__tests__/create.test.ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import createApi from '../create.api'

describe('todos/api/create', () => {
  const handler = testApi(createApi)

  it('使用有效参数创建 todo', async () => {
    const response = await handler({
      title: 'Learn FaasJS',
      description: 'Build a Todo app',
    })

    expect(response.statusCode).toBe(200)
    expect(response.data?.title).toBe('Learn FaasJS')
  })

  it('title 为空时返回 400', async () => {
    const response = await handler({ title: '' })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })
})
```

```ts
// src/pages/todos/api/__tests__/list.test.ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import listApi from '../list.api'

describe('todos/api/list', () => {
  const handler = testApi(listApi)

  it('返回分页结果', async () => {
    const response = await handler({ page: 1, pageSize: 20 })

    expect(response.statusCode).toBe(200)
    expect(response.data?.rows).toBeDefined()
    expect(response.data?.total).toBeDefined()
  })
})
```

测试原则请参见[测试指南](./testing.md)，完整的 API 测试覆盖示例请参见 [CRUD Patterns 指南](./crud-patterns.md)。

### 第 6 步：运行类型生成和测试

创建 API 文件后，生成类型声明以使前端获得完整的类型推导：

```bash
npx faas types
```

这会更新 `src/.faasjs/types.d.ts`，为所有 `.api.ts` 文件添加类型化的路由。

运行测试以验证一切正常：

```bash
vp test
```

`admin` 模板还包含一个 users 切片，使用相同的模式。你可以将其复制作为自己功能的参考。推荐的功能切片布局请参见[应用切片指南](./application-slices.md)。

## 核心概念

### `defineApi` 与 endpoint 定义

每个 API endpoint 都是一个默认导出 `defineApi(...)` 的文件。`schema` 字段使用 Zod 进行输入校验，`handler` 接收类型化的 `params`。

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // params.id 类型为 number
    return { id: params.id }
  },
})
```

详细规则请参见 [defineApi 指南](./define-api.md)。

### 零映射路由

API 文件路径直接映射到请求路径 — 无需路由配置。`src/pages/todos/api/list.api.ts` 文件响应 `POST /pages/todos/api/list` 请求。完整的解析顺序请参见[路由映射规范](../locales/en/specs/routing-mapping.md)。

### `faas.yaml` 配置层级

配置按文件位置和运行环境分层。`src/faas.yaml` 设置基线，更深的 `faas.yaml` 文件可以覆盖特定路径范围的设置。运行环境键（`development`、`production` 等）允许按环境覆盖。

```yaml
defaults:
  server:
    root: .
    base: /api
  plugins:
    http:
      type: http
      config:
        cookie:
          secure: false
```

完整规范请参见 [faas.yaml 规范](../locales/en/specs/faas-yaml.md)。

### `@faasjs/ant-design` 组件

`@faasjs/ant-design` 包提供了业务 UI 包装器，处理 loading、error 和数据请求状态：

| 组件                   | 用途                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `Table.faasData`       | 服务端驱动的列表，参数变化时自动重新请求                          |
| `Form.faas`            | 表单提交，内置 loading、校验和反馈                                |
| `Description.faasData` | 详情视图，含 loading 和 error 状态                                |
| `useApp()`             | 访问 `message`、`notification`、`setDrawerProps`、`setModalProps` |

组件模式请参见 [Ant Design 指南](./ant-design.md)。

### `useFaas` / `faas` 数据请求

| API                                | 使用场景                                                           |
| ---------------------------------- | ------------------------------------------------------------------ |
| `useFaas(action, params, options)` | 组件拥有的请求状态，含 loading、error、debounce、polling 和 reload |
| `faas(action, params)`             | 命令式一次性请求（表单提交、删除）                                 |
| `Form.faas`                        | 表单提交（优先于原始 `faas`）                                      |

生命周期控制和模式请参见 [React 数据请求指南](./react-data-fetching.md)。

### 插件机制

Plugins 将横切关注点（auth、租户上下文、请求元数据）注入请求生命周期。它们在 `faas.yaml` 的 `plugins` 键下配置，并可以用类型化字段扩展 `defineApi` 的 handler 上下文。

插件编写请参见 [Plugin 规范](../locales/en/specs/plugin.md)。

## 开发工作流

FaasJS 工具链使用 `vp`（Vite Plus）作为开发任务的主要入口。

| 命令                       | 用途                                                |
| -------------------------- | --------------------------------------------------- |
| `vp dev`                   | 启动开发服务器，支持热重载                          |
| `vp test`                  | 使用 Vitest 运行所有测试                            |
| `vp test <pattern>`        | 运行匹配文件名的测试                                |
| `vp check --fix`           | 运行 lint 检查和格式化（oxlint + oxfmt）            |
| `npx faas types`           | 重新生成 `src/.faasjs/types.d.ts` 中的 API 类型声明 |
| `npx faasjs-pg migrate`    | 运行待执行的数据库迁移                              |
| `npx faasjs-pg new <name>` | 创建新的时间戳命名迁移文件                          |

### 日常迭代循环

1. 启动开发服务器：`vp dev`
2. 编辑 API 文件（`*.api.ts`）和前端页面（`*.tsx`）
3. 创建、重命名或移动 `.api.ts` 文件后，重新生成类型：`npx faas types`
4. 运行聚焦测试：`vp test src/pages/todos/api/__tests__/list.test.ts`
5. 提交前：`vp check --fix && vp test`

### 数据库迁移

```bash
# 创建新迁移
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new add_due_date_to_todos

# 检查迁移状态
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg status

# 应用待执行迁移
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
```

所有命令和故障排查请参见 [CLI and Tooling 指南](./cli-and-tooling.md)。

## 下一步

现在你已拥有一个可运行的项目，可以探索以下详细指南：

| 指南                                                   | 涵盖内容                                     |
| ------------------------------------------------------ | -------------------------------------------- |
| [应用切片指南](./application-slices.md)                | 垂直功能结构和推荐布局                       |
| [CRUD Patterns 指南](./crud-patterns.md)               | 从 API 到 React 页面的完整 CRUD 实现         |
| [defineApi 指南](./define-api.md)                      | API endpoint schema、校验和错误处理          |
| [Ant Design 指南](./ant-design.md)                     | 页面结构、路由、CRUD 组合和 UI 反馈          |
| [React 数据请求指南](./react-data-fetching.md)         | `useFaas`、`faas`、生命周期控制、轮询和重试  |
| [PG Schema 与迁移指南](./pg-schema-and-migrations.md)  | 数据库迁移编写规则                           |
| [PG 表类型指南](./pg-table-types.md)                   | 在 `Tables` 上的声明合并，实现类型安全的查询 |
| [PG 查询构建器与原生 SQL 指南](./pg-query-builder.md)  | 使用 `@faasjs/pg` 构建查询                   |
| [测试指南](./testing.md)                               | 测试原则和实践                               |
| [React 测试指南](./react-testing.md)                   | React 组件和请求流测试                       |
| [PG 测试指南](./pg-testing.md)                         | PostgreSQL 集成测试                          |
| [CLI and Tooling 指南](./cli-and-tooling.md)           | 所有 CLI 命令、环境变量和故障排查            |
| [项目配置指南](./project-config.md)                    | TypeScript、Vite 和工具链配置                |
| [文件约定](./file-conventions.md)                      | 文件放置和命名约定                           |
| [Jobs 指南](./jobs.md)                                 | 使用 `@faasjs/jobs` 的后台任务               |
| [Logger 指南](./logger.md)                             | 日志模式和日志级别                           |
| [代码注释指南](./code-comments.md)                     | JSDoc 和注释约定                             |
| [faas.yaml 规范](../locales/en/specs/faas-yaml.md)     | faas.yaml 配置完整参考                       |
| [路由映射规范](../locales/en/specs/routing-mapping.md) | 零映射路由解析                               |
| [Plugin 规范](../locales/en/specs/plugin.md)           | 插件编写和配置                               |
| [Http 协议规范](../locales/en/specs/http-protocol.md)  | HTTP 请求/响应协议细节                       |
