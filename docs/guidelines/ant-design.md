# Ant Design Guide

Use when building or reviewing `@faasjs/ant-design` pages, CRUD surfaces, routes, app feedback, modals, and drawers.

## Applicable Scenarios

- Creating new pages or features under `pages/`
- Configuring routes with `Routes` and `lazy`
- Building list, detail, create, update, or delete flows
- Deciding how to split feature frontend files
- Choosing between `faas`, `faasData`, and custom hooks for requests
- Implementing message prompts, notifications, confirmation modals, or drawer workflows

## Default Workflow

1. Follow [File Conventions](./file-conventions.md) and place features under `pages/<feature-name>/`.
2. Use `App` once near the frontend root, then `Routes` plus `lazy` for feature pages.
3. Keep page entries mostly compositional; move concrete UI to `components/` only when it earns a boundary.
4. Put feature-local request files under `api/` and keep action paths aligned with file paths.
5. Model business fields as shared `items` metadata reused by `Form`, `Description`, and `Table`.
6. Start CRUD with `Table`, `Description`, and `Form`; use `useApp()` for `message`, `notification`, `setModalProps`, and `setDrawerProps`.

## Recommended Layout

```text
src/pages/users/
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

This keeps:

- Routes in `pages/`
- Feature UI in `components/`
- Feature-specific reusable logic in `hooks/`
- Backend handlers in `api/`

Actions map directly to:

- `/pages/users/api/list`
- `/pages/users/api/detail`
- `/pages/users/api/create`
- `/pages/users/api/update`
- `/pages/users/api/remove`

## Core Patterns

### Routes and page entries

Root routes should stay minimal, letting each feature lazy-load its own entry:

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

Feature entry files should focus on composing existing components and triggering shared app interactions through `useApp`:

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

### List, detail, edit, delete

For most CRUD pages:

- Use `Table` for the list, `Description` for detail, and `Form` for create/edit.
- Open detail and edit panels in drawers to keep list context visible.
- Use modal confirmations for destructive actions.
- Reuse `items` across list, detail, and form.

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

### Detail view

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

### Create and update forms

- Prefer `Form.faas` when the submission flow is a single direct action call.
- Load edit data outside the form and pass it via `initialValues`.
- Let `useApp` handle success and failure feedback.

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

### Delete and dangerous actions

- Prefer `useApp().setModalProps(...)` over scattered local modal instances.
- Use `message` for short success feedback and `notification` for more complete failure feedback.

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

## Preferred Components

### `Title`

Use for page or section headings. Prefer over hand-written heading markup or setting `document.title` manually in app surfaces.

```tsx
import { Title } from '@faasjs/ant-design'

export default function UsersPage() {
  return <Title title={['Users', 'List']} h1 />
}
```

### `Tabs`

Use for tabbed business views that should share the FaasJS/Ant Design look. Prefer the `id`-driven items shape over raw Ant Design `Tabs`.

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

Use for internal navigation, external links, and button-style navigation. Prefer over raw anchor tags, manual `navigate`, or button + router glue code.

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

Use for empty field display instead of scattering `'-'`, `'N/A'`, or empty fragments through templates.

```tsx
import { Blank } from '@faasjs/ant-design'

export function UserEmail(props: { email?: string | null }) {
  return <Blank value={props.email} />
}
```

### `Loading`

Use for explicit loading surfaces outside component-owned `faasData` lifecycles. Also serves as the default fallback for `FaasDataWrapper`.

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

Use for subtree-level overrides of FaasJS Ant Design copy, theme defaults, or client behavior. Prefer over scattering configuration into leaf components.

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

Use for unstable or isolated areas to prevent render errors from taking down the entire page.

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

Use when wrapper composition or fixed integration boundaries help, for example summary cards, dashboard widgets, or small async components.

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

Use for custom layout tokens instead of hardcoding common spacing, radius, or colors. Essential when writing custom `div`-based blocks that must stay visually consistent with the rest of the app.

```tsx
import { useThemeToken } from '@faasjs/ant-design'

export function Section() {
  const { colorPrimary, borderRadius } = useThemeToken()

  return <div style={{ border: `1px solid ${colorPrimary}`, borderRadius }} />
}
```

### `useModal` / `useDrawer`

Use only for intentionally isolated local instances outside the shared `App` shell. In regular feature pages, prefer `useApp().setModalProps(...)` and `useApp().setDrawerProps(...)`.

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

## Rules

1. Follow the `pages/`, `components/`, `hooks/`, `api/` structure and routing-mapping for feature-local APIs. Feature pages live under `pages/`, entry files use `index.tsx`, components go in `components/`, hooks in `hooks/`, request handlers in `api/`.

2. Use `App` once as the application shell; do not scatter independent app shells through features. `App` owns shared `message`, `notification`, `modal`, and `drawer` behavior. Only drop down to `ConfigProvider` when a smaller boundary is intentional.

3. Treat `items` as the source of truth for business fields across `Form`, `Description`, and `Table`. Start with `id`, `type`, `title`, `options`, and nested `object` definitions. Reuse the same metadata across surfaces unless domain semantics truly diverge.

4. Prefer FaasJS wrappers over raw Ant Design primitives when the wrapper fits common CRUD, loading, empty, route, or feedback surfaces. Start from `Table`, `Description`, `Form`, `Title`, `Tabs`, `Link`, `Blank`, `Loading`, `ErrorBoundary`, and `FaasDataWrapper` before reaching for raw primitives.

5. If custom layout is necessary, read visual values from `useThemeToken()` instead of hardcoding tokens.

   Prefer:

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

   Avoid:

   ```tsx
   export function SummaryCard(props: { children: React.ReactNode }) {
     return (
       <div style={{ padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}>
         {props.children}
       </div>
     )
   }
   ```

6. Use `Form.faas`, `Table.faasData`, `Description.faasData`, and `faas` for straightforward request lifecycles before custom loading/effect plumbing. Lean on built-in request props rather than wiring manual loading state and effect-based glue.

7. Use `useApp()` for shared feedback and overlays. Use `message` for lightweight success/warning feedback, `notification` for persistent feedback with title and description, `setModalProps` for confirmations, and `setDrawerProps` for create/edit/detail panels that should preserve page context. Prefer drawers for in-context create/edit/detail and modals for confirmations. Use local `useModal` or `useDrawer` only when creating isolated instances outside the shared app shell.

8. Promote repeated custom field behavior into `extendTypes`; keep one-off customization on the item itself.

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

9. Use `formRender`, `descriptionRender`, or `tableRender` only when a field truly differs by surface; do not fork fake field ids. `children` and `render` are general overrides, while `formRender`, `descriptionRender`, and `tableRender` are surface-specific. Maintain shared metadata until presentation genuinely diverges.

## Review Checklist

- feature layout and action paths follow the `pages/`, `components/`, `hooks/`, `api/` structure
- routes use `Routes` and `lazy`
- API files align with routing-mapping conventions
- page entry composes feature components instead of containing all logic inline
- shared `items` metadata drives `Form`, `Description`, and `Table`
- wrappers and `faas`/`faasData` cover straightforward request flows
- CRUD pages primarily use `Table`, `Description`, and `Form`
- FaasJS wrapper components are preferred over raw Ant Design primitives where they fit
- custom `div`-based UI is not written unless existing components are insufficient
- custom layout uses `useThemeToken` instead of hardcoded values
- user feedback is centralized through `useApp` instead of scattered local message/modal instances
- create/edit overlays use `setDrawerProps` when page context should be preserved
- destructive confirmations use `setModalProps`
- repeated custom field behavior is promoted to `extendTypes`
- surface-specific overrides are used only when rendering truly differs
