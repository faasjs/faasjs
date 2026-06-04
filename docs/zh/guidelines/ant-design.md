# Ant Design 指南

在构建或审查 `@faasjs/ant-design` 页面、CRUD 界面、路由、应用反馈、模态框和抽屉时使用。

## 适用场景

- 在 `features/` 下创建功能 UI
- 使用 `Routes` 和 `lazy` 配置路由
- 构建列表、详情、创建、更新或删除流程
- 决定如何拆分功能前端文件
- 在 `faas`、`faasData` 和自定义 hooks 之间选择请求方式
- 实现消息提示、通知、确认模态框或抽屉工作流

## 默认工作流

1. 遵循[文件约定](./file-conventions.md)，将功能放在 `features/<功能名称>/` 下。
2. 在前端根目录附近使用一次 `App`，然后用 `Routes` 配合 `lazy` 加载功能 UI 入口。
3. 保持功能入口以组合为主；只有在真正需要边界时才将具体 UI 移到 `components/`。
4. 将功能相关的请求文件放在 `api/` 下，保持 action 路径与文件路径一致。
5. 将业务字段建模为共享的 `items` 元数据，供 `Form`、`Description` 和 `Table` 复用。
6. CRUD 从 `Table`、`Description` 和 `Form` 开始；使用 `useApp()` 获取 `message`、`notification`、`setModalProps` 和 `setDrawerProps`。

## 推荐布局

```text
src/features/users/
  index.tsx
  components/
    UserDescription.tsx
    UserForm.tsx
    UserTable.tsx
  hooks/
    useUserItems.ts
  api/
    create.api.ts
    detail.api.ts
    list.api.ts
    remove.api.ts
    update.api.ts
```

这样保持：

- 功能入口 UI 在 `index.tsx` 中
- 功能 UI 在 `components/` 中
- 功能特定的可复用逻辑在 `hooks/` 中
- 后端处理程序在 `api/` 中

Action 直接映射到：

- `/features/users/api/list`
- `/features/users/api/detail`
- `/features/users/api/create`
- `/features/users/api/update`
- `/features/users/api/remove`

## 核心模式

### 路由和功能入口

根路由应保持最小化，让每个功能懒加载自己的入口：

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

功能入口文件应专注于组合现有组件，并通过 `useApp` 触发共享的应用交互：

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

### 列表、详情、编辑、删除

对于大多数 CRUD 页面：

- 使用 `Table` 显示列表，`Description` 显示详情，`Form` 用于创建/编辑。
- 在抽屉中打开详情和编辑面板，保持列表上下文可见。
- 对破坏性操作使用模态框确认。
- 在列表、详情和表单中复用 `items`。

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
                      await faas('features/users/api/remove', { id: row.id })
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
        action: 'features/users/api/list',
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

### 详情视图

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
        action: 'features/users/api/detail',
        params: {
          id: props.id,
        },
      }}
    />
  )
}
```

### 创建和更新表单

- 当提交流程是单个直接 action 调用时，优先使用 `Form.faas`。
- 在表单外部加载编辑数据，通过 `initialValues` 传入。
- 让 `useApp` 处理成功和失败反馈。

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
        action: props.id ? 'features/users/api/update' : 'features/users/api/create',
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

### 删除和危险操作

- 优先使用 `useApp().setModalProps(...)` 而不是分散的本地模态框实例。
- 使用 `message` 提供简短的成功反馈，使用 `notification` 提供更完整的失败反馈。

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
              await faas('features/users/api/remove', { id: props.id })
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

用于页面或章节标题。优先于手写的标题标记或在应用界面中手动设置 `document.title`。

```tsx
import { Title } from '@faasjs/ant-design'

export default function UsersPage() {
  return <Title title={['Users', 'List']} h1 />
}
```

### `Tabs`

用于应共享 FaasJS/Ant Design 外观的选项卡业务视图。优先使用 `id` 驱动的 items 结构而非原始的 Ant Design `Tabs`。

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

用于内部导航、外部链接和按钮式导航。优先于原始锚标签、手动 `navigate` 或按钮加路由胶水代码。

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

用于空字段显示，而不是在模板中散布 `'-'`、`'N/A'` 或空片段。

```tsx
import { Blank } from '@faasjs/ant-design'

export function UserEmail(props: { email?: string | null }) {
  return <Blank value={props.email} />
}
```

### `Loading`

用于组件自有 `faasData` 生命周期之外显式加载界面。也用作 `FaasDataWrapper` 的默认回退。

```tsx
import { Loading } from '@faasjs/ant-design'

export function UserPanel(props: { loading: boolean }) {
  return (
    <Loading loading={props.loading}>
      <div>Loaded content</div>
    </Loading>
  )
}
```

### `ConfigProvider`

用于子树级别的 FaasJS Ant Design 文案、主题默认值或客户端行为覆盖。优先于将配置分散到叶子组件中。

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

用于不稳定或隔离的区域，以防止渲染错误导致整个页面崩溃。

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

### `FaasDataWrapper` / `withFaasData`

在包装组合或固定集成边界有用时使用，例如摘要卡片、仪表板小组件或小型异步组件。

```tsx
import { FaasDataWrapper } from '@faasjs/ant-design'

export function UserSummary(props: { id: number }) {
  return (
    <FaasDataWrapper action="features/users/api/detail" params={{ id: props.id }}>
      {({ data }) => <div>{data?.name}</div>}
    </FaasDataWrapper>
  )
}
```

### `useThemeToken`

用于自定义布局令牌，而不是硬编码常见的间距、圆角或颜色。在编写自定义基于 `div` 的块且必须与应用的其余部分保持视觉一致时至关重要。

```tsx
import { useThemeToken } from '@faasjs/ant-design'

export function Section() {
  const { colorPrimary, borderRadius } = useThemeToken()

  return <div style={{ border: `1px solid ${colorPrimary}`, borderRadius }} />
}
```

### `useModal` / `useDrawer`

仅在有意隔离的本地实例需要位于共享 `App` 外壳之外时使用。在常规功能 UI 中，优先使用 `useApp().setModalProps(...)` 和 `useApp().setDrawerProps(...)`。

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

1. 遵循 `features/`、`components/`、`hooks/`、`api/` 结构和功能本地 API 的路由映射。功能 UI 位于 `features/<feature>/` 下，入口文件使用 `index.tsx`，组件放在 `components/` 中，hooks 放在 `hooks/` 中，请求处理程序放在 `api/` 中。

2. 使用 `App` 一次作为应用程序外壳；不要将独立的应用程序外壳分散到各功能中。`App` 拥有共享的 `message`、`notification`、`modal` 和 `drawer` 行为。仅在有意缩小边界时才降级使用 `ConfigProvider`。

3. 将 `items` 视为跨 `Form`、`Description` 和 `Table` 的业务字段的单一事实来源。从 `id`、`type`、`title`、`options` 和嵌套的 `object` 定义开始。跨界面复用相同的元数据，除非领域语义确实存在分歧。

4. 在 FaasJS 包装器适合常见的 CRUD、加载、空状态、路由或反馈界面时，优先使用 FaasJS 包装器而非原始 Ant Design 原语。从 `Table`、`Description`、`Form`、`Title`、`Tabs`、`Link`、`Blank`、`Loading`、`ErrorBoundary` 和 `FaasDataWrapper` 开始，然后再考虑使用原始原语。

5. 如果必须自定义布局，从 `useThemeToken()` 读取视觉值，而不是硬编码令牌。

   优先：

   ```tsx
   import { useThemeToken } from '@faasjs/ant-design'

   export function SummaryCard(props: { children: React.ReactNode }) {
     const { colorBorder, borderRadiusLG, padding } = useThemeToken()

     return (
       <div style={{ padding, border: `1px solid ${colorBorder}`, borderRadius: borderRadiusLG }}>
         {props.children}
       </div>
     )
   }
   ```

   避免：

   ```tsx
   export function SummaryCard(props: { children: React.ReactNode }) {
     return (
       <div style={{ padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
         {props.children}
       </div>
     )
   }
   ```

6. 在自定义加载/副作用管道之前，使用 `Form.faas`、`Table.faasData`、`Description.faasData` 和 `faas` 处理直接的请求生命周期。依赖内置的请求属性，而不是手动连接加载状态和基于副作用的胶水代码。

7. 使用 `useApp()` 处理共享的反馈和覆盖层。使用 `message` 处理轻量级的成功/警告反馈，使用 `notification` 处理带有标题和描述的持久反馈，使用 `setModalProps` 处理确认，使用 `setDrawerProps` 处理应保持页面上下文的创建/编辑/详情面板。优先使用抽屉进行上下文内的创建/编辑/详情，使用模态框进行确认。仅在创建共享应用程序外壳之外的隔离实例时使用本地 `useModal` 或 `useDrawer`。

8. 将重复的自定义字段行为提升到 `extendTypes` 中；将一次性自定义保留在 item 本身上。

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

9. 仅在字段确实因界面而异时使用 `formRender`、`descriptionRender` 或 `tableRender`；不要创建伪造的字段 ID。`children` 和 `render` 是通用覆盖，而 `formRender`、`descriptionRender` 和 `tableRender` 是特定于界面的。保持共享元数据，直到呈现真正出现分歧。

## 审查清单

- [ ] 功能布局和 action 路径遵循 `features/`、`components/`、`hooks/`、`api/` 结构
- [ ] 路由使用 `Routes` 和 `lazy`
- [ ] API 文件符合路由映射约定
- [ ] 功能入口组合功能组件而非内联包含所有逻辑
- [ ] 共享的 `items` 元数据驱动 `Form`、`Description` 和 `Table`
- [ ] 包装器和 `faas`/`faasData` 覆盖直接的请求流程
- [ ] CRUD 页面主要使用 `Table`、`Description` 和 `Form`
- [ ] 在适用的地方优先使用 FaasJS 包装组件而非原始 Ant Design 原语
- [ ] 除非现有组件不够用，否则不编写自定义基于 `div` 的 UI
- [ ] 自定义布局使用 `useThemeToken` 而非硬编码值
- [ ] 用户反馈通过 `useApp` 集中处理，而非分散的本地 message/modal 实例
- [ ] 创建/编辑覆盖层使用 `setDrawerProps` 以保持页面上下文
- [ ] 破坏性确认使用 `setModalProps`
- [ ] 重复的自定义字段行为已提升到 `extendTypes`
- [ ] 仅在实际呈现不同时才使用特定于界面的覆盖

## 延伸阅读

- [文件约定](./file-conventions.md)
- [defineApi 指南](./define-api.md)
- [React 数据获取指南](./react-data-fetching.md)
- [@faasjs/ant-design](/doc/ant-design/)
- [App](/doc/ant-design/functions/App.html)
- [Routes](/doc/ant-design/functions/Routes.html)
- [Form](/doc/ant-design/functions/Form.html)
- [Description](/doc/ant-design/functions/Description.html)
- [Table](/doc/ant-design/functions/Table.html)
- [useApp](/doc/ant-design/functions/useApp.html)
- [useModal](/doc/ant-design/functions/useModal.html)
- [useDrawer](/doc/ant-design/functions/useDrawer.html)
