# Ant Design 指南

当你在开发或评审基于 `@faasjs/ant-design` 的前端功能时，请使用这份指南。

## 适用场景

- 在 `pages/` 下创建新页面或 feature
- 使用 `Routes` 与 `lazy` 配置路由
- 构建列表、详情、新建、更新或删除流程
- 决定一个 feature 的前端文件该如何拆分
- 判断请求应该使用 `faas`、`faasData` 还是自定义 hook
- 实现消息提示、通知、确认弹窗或抽屉工作流

## 默认工作流

1. 先遵循 [文件约定](./file-conventions.md) 指南，把功能放到 `pages/<feature-name>/` 下。
2. 在前端根部附近只使用一次 `App`，并用 `Routes` + `lazy` 挂载各个 feature 页面。
3. 让 feature 页面聚焦于组合，把具体 UI 片段下沉到 `components/`。
4. 把 feature 内部请求文件放在 `api/` 下，并保持路由路径与文件路径对齐。
5. 把业务字段建模为 `items` metadata，并在 `Form`、`Description` 与 `Table` 中复用。
6. 对标准 CRUD 流程，列表从 `Table` 开始，详情从 `Description` 开始，新建 / 编辑从 `Form` 开始。
7. 对交互反馈，优先通过 `useApp()` 使用 `message`、`notification`、`setModalProps` 和 `setDrawerProps`。

## 推荐的功能目录结构

对于 users 这类典型 CRUD 功能，推荐采用如下结构：

```text
src/pages/
  index.tsx
  users/
    index.tsx
    components/
      UserDescription.tsx
      UserForm.tsx
      UserTable.tsx
    hooks/
      useUserItems.ts
    api/
      create.func.ts
      detail.func.ts
      list.func.ts
      remove.func.ts
      update.func.ts
```

这样可以把：

- 路由放在 `pages/`
- feature UI 放在 `components/`
- feature 内可复用逻辑放在 `hooks/`
- 后端处理器放在 `api/`

对应的 action paths 会直接映射为：

- `/pages/users/api/list`
- `/pages/users/api/detail`
- `/pages/users/api/create`
- `/pages/users/api/update`
- `/pages/users/api/remove`

## 项目模式

根路由应尽量保持简单，让每个 feature 自己 lazy-load 对应的页面入口：

```tsx
import { Routes, lazy } from '@faasjs/ant-design'

export default function Pages() {
  return (
    <Routes
      routes={[
        {
          path: 'users',
          page: lazy(() => import('./users')),
        },
      ]}
    />
  )
}
```

Feature 入口文件应主要负责组合现有组件，并通过 `useApp` 触发共享应用交互：

```tsx
import { Button, Space } from 'antd'
import { useApp } from '@faasjs/ant-design'

import { UserForm } from './components/UserForm'
import { UserTable } from './components/UserTable'

export default function UsersPage() {
  const { setDrawerProps } = useApp()

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        type="primary"
        onClick={() =>
          setDrawerProps({
            open: true,
            title: 'Create User',
            width: 720,
            children: <UserForm />,
          })
        }
      >
        Create User
      </Button>

      <UserTable />
    </Space>
  )
}
```

## 典型 CRUD 流程

### 1. 列表、详情、编辑、删除

对大多数 CRUD 页面：

- 列表页使用 `Table`
- 详情面板使用 `Description`
- 新建 / 编辑流程使用 `Form`
- 详情与编辑面板优先通过 `setDrawerProps` 在上下文中打开
- 删除确认优先通过 `setModalProps` 实现
- 反馈优先使用 `useApp` 提供的 `message` 与 `notification`
- 在列表、详情和表单之间复用同一份 `items` 定义

示例：

```tsx
import { Button, Space } from 'antd'
import { faas, Table, useApp } from '@faasjs/ant-design'

import { useUserItems } from '../hooks/useUserItems'
import { UserDescription } from './UserDescription'
import { UserForm } from './UserForm'

export function UserTable() {
  const { message, setDrawerProps, setModalProps } = useApp()
  const items = useUserItems()

  return (
    <Table
      rowKey="id"
      items={[
        ...items,
        {
          id: 'actions',
          title: 'Actions',
          tableRender: (_, row) => (
            <Space>
              <Button
                size="small"
                onClick={() =>
                  setDrawerProps({
                    open: true,
                    title: `User #${row.id}`,
                    width: 720,
                    children: <UserDescription id={row.id} />,
                  })
                }
              >
                Detail
              </Button>
              <Button
                size="small"
                onClick={() =>
                  setDrawerProps({
                    open: true,
                    title: `Edit User #${row.id}`,
                    width: 720,
                    children: <UserForm id={row.id} initialValues={row} />,
                  })
                }
              >
                Edit
              </Button>
              <Button
                danger
                size="small"
                onClick={() =>
                  setModalProps({
                    open: true,
                    title: 'Delete User',
                    children: 'This action cannot be undone.',
                    onOk: async () => {
                      await faas('/pages/users/api/remove', { id: row.id })
                      message.success('User deleted')
                      setModalProps({ open: false })
                    },
                  })
                }
              >
                Delete
              </Button>
            </Space>
          ),
        },
      ]}
      faasData={{
        action: '/pages/users/api/list',
      }}
      pagination={{
        pageSize: 20,
      }}
      onRow={(record) => ({
        onDoubleClick: () =>
          setDrawerProps({
            open: true,
            title: `User #${record.id}`,
            width: 720,
            children: <UserDescription id={record.id} />,
          }),
      })}
    />
  )
}
```

### 2. 详情

```tsx
import { Description } from '@faasjs/ant-design'

import { useUserItems } from '../hooks/useUserItems'

export function UserDescription(props: { id: number }) {
  const items = useUserItems()

  return (
    <Description
      column={1}
      items={items}
      faasData={{
        action: '/pages/users/api/detail',
        params: {
          id: props.id,
        },
      }}
    />
  )
}
```

### 3. 新建或更新

- 当提交流程只是一次直接 action 调用时，优先使用 `Form.faas`。
- 编辑数据应在表单外部加载，再通过 `initialValues` 传入。
- 成功与失败反馈交给 `useApp` 统一处理。

```tsx
import { Form, useApp } from '@faasjs/ant-design'

import { useUserItems } from '../hooks/useUserItems'

export function UserForm(props: { id?: number; initialValues?: Record<string, any> }) {
  const { message, notification, setDrawerProps } = useApp()
  const items = useUserItems()

  return (
    <Form
      initialValues={props.initialValues}
      items={items}
      faas={{
        action: props.id ? '/pages/users/api/update' : '/pages/users/api/create',
        params: (values) => ({
          ...values,
          ...(props.id ? { id: props.id } : {}),
        }),
        onSuccess: () => {
          message.success(props.id ? 'User updated' : 'User created')
          setDrawerProps({ open: false })
        },
        onError: (error) => {
          notification.error({
            message: props.id ? 'Update failed' : 'Create failed',
            description: error?.message || 'Unknown error',
          })
        },
      }}
    />
  )
}
```

### 4. 删除或危险操作

- 在普通业务页面中，优先使用 `useApp().setModalProps(...)`，而不是零散的本地 modal 实例。
- 短小成功反馈使用 `message`，更完整的失败反馈使用 `notification`。

```tsx
import { Button } from 'antd'
import { faas, useApp } from '@faasjs/ant-design'

export function RemoveButton(props: { id: number }) {
  const { message, notification, setModalProps } = useApp()

  return (
    <Button
      danger
      onClick={() =>
        setModalProps({
          open: true,
          title: 'Delete User',
          children: 'Please confirm the deletion.',
          onOk: async () => {
            try {
              await faas('/pages/users/api/remove', { id: props.id })
              message.success('User deleted')
              setModalProps({ open: false })
            } catch (error: any) {
              notification.error({
                message: 'Delete failed',
                description: error?.message || 'Unknown error',
              })
            }
          },
        })
      }
    >
      Delete
    </Button>
  )
}
```

## 推荐组件

### `Title`

当页面既需要设置标题副作用，又可能需要一个可见 heading 时，优先使用它，而不是手写 `document.title`。

```tsx
import { Title } from '@faasjs/ant-design'

export default function UsersPage() {
  return <Title title={['Users', 'List']} h1 />
}
```

### `Tabs`

当你希望用更简洁的 `id` 驱动 tabs 定义相关子视图（如 profile、permissions、logs）时，优先使用它，而不是直接使用原始 Ant Design `Tabs`。

```tsx
import { Tabs } from '@faasjs/ant-design'

export function UserTabs() {
  return (
    <Tabs
      items={[
        { id: 'profile', children: <div>Profile</div> },
        { id: 'logs', children: <div>Logs</div> },
      ]}
    />
  )
}
```

### `Link`

内部跳转、外链以及 button-style 跳转时，优先使用它，而不是原始 anchor、手动 `navigate` 或按钮 + router 胶水代码。

```tsx
import { Link } from '@faasjs/ant-design'

export function Actions() {
  return (
    <Link href="/users/create" button={{ type: 'primary' }}>
      Create User
    </Link>
  )
}
```

### `Blank`

当一个字段可能为空，且需要一致的占位展示时，优先使用它，而不是到处散落 `'-'`、`'N/A'` 或空 fragment。

```tsx
import { Blank } from '@faasjs/ant-design'

export function UserEmail(props: { email?: string | null }) {
  return <Blank value={props.email} />
}
```

### `Loading`

轻量本地 loading 状态时，优先使用它，而不是手工摆 `Spin`；也可以让 `FaasDataWrapper` 把它作为默认 fallback。

```tsx
import { Loading } from '@faasjs/ant-design'

export function UserPanel(props: { loading: boolean }) {
  return (
    <Loading loading={props.loading}>
      <div>Loaded</div>
    </Loading>
  )
}
```

### `ConfigProvider`

当你需要为某个子树覆盖 FaasJS Ant Design 文案、主题默认值或 client 行为时，优先使用它，而不是把配置散落到叶子组件里。

```tsx
import { Blank, ConfigProvider } from '@faasjs/ant-design'

export function EmptyState() {
  return (
    <ConfigProvider theme={{ common: { blank: 'No data' } }}>
      <Blank />
    </ConfigProvider>
  )
}
```

### `ErrorBoundary`

对不稳定或隔离区域，优先包一层它，让渲染错误变成用户可见的提示，而不是把整页打挂。

```tsx
import { ErrorBoundary } from '@faasjs/ant-design'

export function Page() {
  return (
    <ErrorBoundary>
      <DangerousWidget />
    </ErrorBoundary>
  )
}
```

### `FaasDataWrapper` 或 `withFaasData`

当组件需要直接获取数据，但又不适合 `Table` 或 `Description`，例如 summary cards、dashboard widgets 或小型异步组件时，优先考虑它们。

```tsx
import { FaasDataWrapper } from '@faasjs/ant-design'

export function UserSummary(props: { id: number }) {
  return (
    <FaasDataWrapper action="/pages/users/api/detail" params={{ id: props.id }}>
      {({ data }) => <div>{data?.name}</div>}
    </FaasDataWrapper>
  )
}
```

### `useThemeToken`

当自定义组件需要读取 Ant Design theme tokens（如 spacing、colors、radius）时，优先使用它，而不是硬编码设计值。如果你确实需要手工写一个 `div` 结构的自定义块，也应通过这个 hook 让它与应用其余部分保持一致。

```tsx
import { useThemeToken } from '@faasjs/ant-design'

export function Section() {
  const { colorPrimary, borderRadius } = useThemeToken()

  return <div style={{ border: `1px solid ${colorPrimary}`, borderRadius }} />
}
```

### `useModal` 与 `useDrawer`

只有当你明确需要在共享 `App` shell 之外创建本地隔离的 modal / drawer 实例时，才使用它们。在普通 feature 页面中，仍然优先使用 `useApp().setModalProps(...)` 与 `useApp().setDrawerProps(...)`。

```tsx
import { Button } from 'antd'
import { useDrawer } from '@faasjs/ant-design'

export function LocalPreview() {
  const { drawer, setDrawerProps } = useDrawer()

  return (
    <>
      <Button
        onClick={() => setDrawerProps({ open: true, title: 'Preview', children: <div>Body</div> })}
      >
        Open
      </Button>
      {drawer}
    </>
  )
}
```

## 规则

### 1. 构建 Ant Design feature 时先遵循文件约定

- 前端页面放在 `pages/` 下。
- 页面入口文件使用 `index.tsx`。
- 页面入口应聚焦于组合。
- feature 组件放在 `components/`，hooks 放在 `hooks/`，请求处理器放在 `api/`。
- 所有文件都应作用域化在这个 feature 内，而不是在全局层面扁平展开。

### 2. 把 `App` 作为唯一应用壳层使用一次

- 优先使用一个根级 `App` wrapper，而不是为每个页面分别包一层。
- `App` 是共享 message、notification、modal 与 drawer 行为的默认承载点。
- `App` 也负责接通 FaasJS 错误处理与可选的浏览器路由。
- 只有当你明确需要更小边界时，才单独使用 `ConfigProvider`。

### 3. 把 `items` metadata 当作单一事实来源

- 从 `id`、`type`、`title`、`options` 与嵌套 `object` 定义开始建模。
- 只要字段语义相同，就在 `Form`、`Description` 与 `Table` 之间复用同一份 metadata。
- 让内建的 normalization logic 处理 labels、options 与 value conversion。
- 除非领域语义真的不同，否则不要把同一个字段复制成三套列表 / 详情 / 表单配置对象。

### 4. 常见 CRUD 面优先使用内建组件

- 列表页先从 `Table` 开始。
- 详情页先从 `Description` 开始。
- 新建 / 编辑页先从 `Form` 开始。
- 同时，优先使用 `Title`、`Tabs`、`Link`、`Blank`、`Loading`、`ErrorBoundary` 和 `FaasDataWrapper` 这类 FaasJS 封装组件，而不是直接下沉到原始 Ant Design primitives 或手写胶水代码。
- 如果已有组件已经适配场景，就不要手工用零散 `div` 堆布局或状态展示。
- 只有在现有组件明显不适配功能需求时，才编写更底层的自定义 UI。

### 4.1. 如果必须自定义布局，就使用 `useThemeToken`

- 当你确实需要手写一个 `div` 结构的 block 时，应通过 `useThemeToken()` 读取 spacing、colors、radius 等设计值。
- 除非有非常强的理由，否则不要硬编码 border color、radius 或 spacing 这类视觉 token。
- 这样能让自定义 UI 仍然与 Ant Design 及周边 FaasJS 组件保持一致。

优先这样写：

```tsx
import { useThemeToken } from '@faasjs/ant-design'

export function SummaryCard(props: { children: React.ReactNode }) {
  const { colorBorder, borderRadiusLG, padding } = useThemeToken()

  return (
    <div
      style={{
        padding,
        border: `1px solid ${colorBorder}`,
        borderRadius: borderRadiusLG,
      }}
    >
      {props.children}
    </div>
  )
}
```

避免这样写：

```tsx
export function SummaryCard(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 12,
        border: '1px solid #d9d9d9',
        borderRadius: 8,
      }}
    >
      {props.children}
    </div>
  )
}
```

### 5. 简单请求生命周期优先使用 `faas` 与 `faasData`

- 当提交流程只是一次直接 action 调用时，优先使用 `Form.faas`。
- 当组件能够自己持有请求生命周期时，优先使用 `Description.faasData` 和 `Table.faasData`。
- 对于简单场景，优先使用这些内建请求 props，而不是自己写 loading state 和基于 effect 的请求胶水逻辑。
- 如果多个界面需要共享 reload 或编排逻辑，可以抽 feature hook，但叶子组件合同应保持简单。

### 6. 交互反馈与遮罩层优先使用 `useApp`

- 在被 `App` 包裹的子树中，使用 `useApp()` 获取 `message`、`notification`、`setModalProps` 和 `setDrawerProps`。
- 轻量成功 / 警告反馈使用 `message`。
- 需要标题、描述或更长停留时间的反馈使用 `notification`。
- 确认类流程与短暂阻断流程使用 `setModalProps`。
- 新建、编辑或详情面板需要保留页面上下文时，使用 `setDrawerProps`。
- 只有当你明确需要在共享应用壳外创建隔离实例时，才使用本地 `useModal` 或 `useDrawer`。

### 7. 在上下文中完成的新建 / 编辑流程优先使用 drawer

- 当用户需要持续看到列表上下文时，应通过 `useApp` 在共享 drawer 中打开表单。
- 当流程具有破坏性，或需要显式确认时，使用 modal。
- 只有当该流程值得拥有独立 URL、导航状态或更大的独立布局时，才使用独立 route page。

### 8. 重复出现的自定义字段行为应提升到 `extendTypes`

- 当某个自定义字段类型出现不止一次，或已经属于项目领域模型的一部分时，使用 `extendTypes`。
- 一次性定制保留在单个 item 上即可。
- 当你引入项目特有 type names 时，优先为 `Form`、`Table` 或 `Description` 建立带类型的封装。
- 不要把同样的自定义 renderer 复制到很多 item definitions 中。

示例：

```tsx
import { Form, type ExtendFormItemProps, type FormProps } from '@faasjs/ant-design'
import { Input } from 'antd'

interface UserFormItem extends ExtendFormItemProps {
  type: 'password'
}

function UserForm(props: FormProps<any, UserFormItem>) {
  return (
    <Form
      {...props}
      extendTypes={{
        password: {
          children: <Input.Password />,
        },
      }}
    />
  )
}
```

### 9. 只有当视图差异真实存在时才使用 surface-specific overrides

- `children` 与 `render` 是通用 override。
- `formChildren` 与 `formRender` 是 form-only override。
- `descriptionChildren` 与 `descriptionRender` 是 description-only override。
- `tableChildren` 与 `tableRender` 是 table-only override。
- 在展示方式没有真正分叉前，应优先维持共享 metadata。
- 不要仅仅为了改渲染，就把一个字段拆成 `statusForForm`、`statusForTable`、`statusForDescription` 这类假的 ids。

## 评审清单

- 该 feature 遵循了 `pages/`、`components/`、`hooks/`、`api/` 结构
- 路由通过 `Routes` 与 `lazy` 接线
- API 文件与 routing-mapping 保持对齐
- 页面入口主要在组合 feature 组件，而不是把全部逻辑内联进去
- 字段定义通过共享 `items` metadata 建模
- 简单请求流使用的是 `faas` 与 `faasData`
- CRUD 页面主要使用 `Table`、`Description` 与 `Form`
- 在适配场景时，优先使用 FaasJS 封装组件，而不是直接下沉到原始 Ant Design primitives
- 除非现有组件不适配，否则不会随意手写基于 `div` 的自定义 UI
- 当必须自定义布局时，通过 `useThemeToken` 读取视觉值，而不是硬编码
- 交互反馈通过 `useApp` 统一处理，而不是零散本地 message / modal
- 在需要保留页面上下文时，新建 / 编辑覆盖层使用 `setDrawerProps`
- 确认类流程使用 `setModalProps`
- 重复自定义字段行为被抽到了 `extendTypes`
- 只有渲染确实不同，才使用 surface-specific overrides

## 延伸阅读

- [文件约定](./file-conventions.md)
- [defineApi 指南](./define-api.md)
- [React 数据请求指南](./react-data-fetching.md)
- [@faasjs/ant-design](/doc/ant-design/)
- [App](/doc/ant-design/functions/App.html)
- [Routes](/doc/ant-design/functions/Routes.html)
- [Form](/doc/ant-design/functions/Form.html)
- [Description](/doc/ant-design/functions/Description.html)
- [Table](/doc/ant-design/functions/Table.html)
- [useApp](/doc/ant-design/functions/useApp.html)
- [useModal](/doc/ant-design/functions/useModal.html)
- [useDrawer](/doc/ant-design/functions/useDrawer.html)
