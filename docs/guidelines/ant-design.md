# Ant Design Guide

Use this guide when developing or reviewing frontend features built with `@faasjs/ant-design`.

## Use This Guide When

- creating a new page or feature under `pages/`
- wiring routes with `Routes` and `lazy`
- building list, detail, create, update, or delete flows
- deciding how to split frontend files for a feature
- deciding whether a request should use `faas`, `faasData`, or a custom hook
- implementing messages, notifications, modal confirmations, or drawer workflows

## Default Workflow

1. Follow the [File Conventions](./file-conventions.md) guide first and place the feature under `pages/<feature-name>/`.
2. Use `App` once near the frontend root and use `Routes` plus `lazy` to mount feature pages.
3. Keep the feature page focused on composition and move concrete UI pieces into `components/`.
4. Put feature-local request files under `api/` and keep route paths aligned with file paths.
5. Model business fields as `items` metadata and reuse them across `Form`, `Description`, and `Table`.
6. For standard CRUD flows, start with `Table` for list, `Description` for detail, and `Form` for create or edit.
7. For interaction feedback, prefer `useApp()` for `message`, `notification`, `setModalProps`, and `setDrawerProps`.

## Recommended Feature Layout

For a typical CRUD feature such as users, prefer a layout like this:

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

This keeps:

- routing in `pages/`
- feature UI in `components/`
- feature-local reusable logic in `hooks/`
- backend handlers in `api/`

The corresponding action paths will map directly to:

- `/pages/users/api/list`
- `/pages/users/api/detail`
- `/pages/users/api/create`
- `/pages/users/api/update`
- `/pages/users/api/remove`

## Project Pattern

Root routes should stay simple and let each feature lazy-load its own page entry:

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

Feature entry files should mainly compose existing components and trigger shared app interactions through `useApp`:

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

## Typical CRUD Flow

### 1. List, Detail, Edit, Delete

For most CRUD pages:

- use `Table` for list pages
- use `Description` for detail panels
- use `Form` for create and edit flows
- use `setDrawerProps` for in-context detail and edit panels
- use `setModalProps` for delete confirmation
- use `message` and `notification` from `useApp` for feedback
- reuse one shared `items` definition across list, detail, and form

Example:

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

### 2. Detail

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

### 3. Create or Update

- Prefer `Form.faas` when the submit flow is one direct action call.
- Load edit data outside the form, then pass it through `initialValues`.
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

### 4. Delete or Dangerous Operations

- In normal app pages, prefer `useApp().setModalProps(...)` over ad hoc local modal instances.
- Use `message` for short success feedback and `notification` for richer failure feedback.

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

Prefer over hand-written `document.title` logic when a page needs both title side effects and an optional visible heading.

```tsx
import { Title } from '@faasjs/ant-design'

export default function UsersPage() {
  return <Title title={['Users', 'List']} h1 />
}
```

### `Tabs`

Prefer over raw Ant Design `Tabs` when you want simpler `id`-based tab definitions for related subviews such as profile, permissions, and logs.

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

Prefer over raw anchors, manual `navigate`, or button-plus-router glue for internal navigation, external links, and button-style jumps.

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

Prefer over ad hoc `'-'`, `'N/A'`, or empty fragments when a field may be empty and should render a consistent placeholder.

```tsx
import { Blank } from '@faasjs/ant-design'

export function UserEmail(props: { email?: string | null }) {
  return <Blank value={props.email} />
}
```

### `Loading`

Prefer over manually placed `Spin` wrappers for lightweight local loading states, or let `FaasDataWrapper` use it as the default fallback.

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

Prefer when you need to override FaasJS Ant Design copy, theme defaults, or client behavior for a subtree instead of scattering config in leaf components.

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

Prefer around unstable or isolated regions so a rendering error becomes a visible alert instead of breaking the whole page.

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

### `FaasDataWrapper` or `withFaasData`

Prefer when a component should fetch data directly but does not fit `Table` or `Description`, such as summary cards, dashboards, or small async widgets.

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

Prefer when a custom component needs Ant Design theme tokens for spacing, colors, or radius, instead of hardcoding design values. If you truly need to build a custom `div`-based block, use this hook to keep the UI aligned with the rest of the app.

```tsx
import { useThemeToken } from '@faasjs/ant-design'

export function Section() {
  const { colorPrimary, borderRadius } = useThemeToken()

  return <div style={{ border: `1px solid ${colorPrimary}`, borderRadius }} />
}
```

### `useModal` and `useDrawer`

Use only when you intentionally need a local isolated modal or drawer instance outside the shared `App` shell. In normal feature pages, still prefer `useApp().setModalProps(...)` and `useApp().setDrawerProps(...)`.

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

### 1. Follow file conventions when building Ant Design features

- Put frontend pages under `pages/`.
- Use `index.tsx` as the page entry file.
- Keep page entries focused on composition.
- Place feature components in `components/`, hooks in `hooks/`, and request handlers in `api/`.
- Keep all files scoped to the feature instead of flattening them globally.

### 2. Use `App` once as the application shell

- Prefer one root `App` wrapper instead of wrapping each page separately.
- `App` is the default home for shared message, notification, modal, and drawer behavior.
- `App` also wires FaasJS error handling and optional browser routing.
- Use `ConfigProvider` alone only when you intentionally need a smaller boundary.

### 3. Treat `items` metadata as the source of truth

- Start from `id`, `type`, `title`, `options`, and nested `object` definitions.
- Reuse the same metadata across `Form`, `Description`, and `Table` whenever the field meaning is the same.
- Let the built-in normalization logic handle labels, options, and value conversion.
- Avoid duplicating one field into separate config objects for list, detail, and form unless the domain meaning is different.

### 4. Prefer built-in components for common CRUD surfaces

- For list pages, start with `Table`.
- For detail pages, start with `Description`.
- For create and edit pages, start with `Form`.
- Also prefer FaasJS wrappers such as `Title`, `Tabs`, `Link`, `Blank`, `Loading`, `ErrorBoundary`, and `FaasDataWrapper` before dropping to raw Ant Design primitives or hand-written glue code.
- Avoid hand-building layout or state display with ad hoc `div` blocks when an existing component already fits the scenario.
- Only build lower-level custom UI when the existing components clearly do not fit the feature.

### 4.1. If custom layout is necessary, use `useThemeToken`

- If you have to build a custom `div`-based block, read spacing, colors, radius, and similar values from `useThemeToken()`.
- Do not hardcode visual tokens such as border color, radius, or spacing unless there is a strong reason.
- This keeps custom UI aligned with Ant Design and the surrounding FaasJS components.

Prefer this:

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

Avoid this:

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

### 5. Prefer `faas` and `faasData` for straightforward request lifecycles

- Use `Form.faas` when the submit flow is one direct action call.
- Use `Description.faasData` and `Table.faasData` when the component can own its fetch lifecycle.
- Prefer these built-in request props over manual loading state and effect-based request plumbing for simple cases.
- If multiple surfaces need shared reload or orchestration logic, extract a feature hook, but keep the leaf component contracts simple.

### 6. Prefer `useApp` for interactive feedback and overlays

- Inside a subtree wrapped by `App`, use `useApp()` for `message`, `notification`, `setModalProps`, and `setDrawerProps`.
- Prefer `message` for lightweight success or warning feedback.
- Prefer `notification` when the feedback needs a title, description, or longer persistence.
- Prefer `setModalProps` for confirmations and short interruptive flows.
- Prefer `setDrawerProps` for create, edit, or detail panels that should keep page context visible.
- Reach for local `useModal` or `useDrawer` only when you intentionally need an isolated instance outside the shared app shell.

### 7. Prefer drawers for in-context create or edit flows

- When the user should keep the list context visible, open forms in a shared drawer via `useApp`.
- When the workflow is destructive or requires explicit confirmation, use a modal.
- Use a dedicated route page only when the flow deserves its own URL, navigation state, or larger standalone layout.

### 8. Promote repeated custom field behavior into `extendTypes`

- Use `extendTypes` when a custom field type appears more than once or belongs to the project domain.
- Keep one-off customization on the item itself.
- Prefer typed wrappers around `Form`, `Table`, or `Description` when you introduce project-specific type names.
- Do not copy the same custom renderer into many item definitions.

Example:

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

### 9. Use surface-specific overrides only for real view differences

- `children` and `render` are shared overrides.
- `formChildren` and `formRender` are form-only overrides.
- `descriptionChildren` and `descriptionRender` are description-only overrides.
- `tableChildren` and `tableRender` are table-only overrides.
- Prefer shared metadata until the presentation truly diverges by surface.
- Do not fork a field into fake ids such as `statusForForm`, `statusForTable`, and `statusForDescription` just to change rendering.

## Review Checklist

- the feature follows the `pages/`, `components/`, `hooks/`, `api/` structure
- routes are wired with `Routes` and `lazy`
- API files stay aligned with routing-mapping
- the page entry mostly composes feature components instead of containing all logic inline
- field definitions are modeled through shared `items` metadata
- `faas` and `faasData` are used for straightforward request flows
- CRUD pages primarily use `Table`, `Description`, and `Form`
- FaasJS-provided wrappers are preferred over raw Ant Design primitives when they cover the scenario
- custom `div`-based UI is avoided unless existing components do not fit
- when custom layout is necessary, it uses `useThemeToken` instead of hardcoded visual values
- interaction feedback uses `useApp` instead of scattered local modal or message usage
- create or edit overlays use `setDrawerProps` when staying in page context is desirable
- confirmations use `setModalProps`
- repeated custom field behavior is extracted into `extendTypes`
- surface-specific overrides are used only when rendering truly differs

## Read Next

- [File Conventions](./file-conventions.md)
- [defineApi Guide](./define-api.md)
- [React Data Fetching Guide](./react-data-fetching.md)
- [@faasjs/ant-design](/doc/ant-design/)
- [App](/doc/ant-design/functions/App.html)
- [Routes](/doc/ant-design/functions/Routes.html)
- [Form](/doc/ant-design/functions/Form.html)
- [Description](/doc/ant-design/functions/Description.html)
- [Table](/doc/ant-design/functions/Table.html)
- [useApp](/doc/ant-design/functions/useApp.html)
- [useModal](/doc/ant-design/functions/useModal.html)
- [useDrawer](/doc/ant-design/functions/useDrawer.html)
