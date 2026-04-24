# Ant Design Guide

Use for `@faasjs/ant-design` pages, CRUD surfaces, routes, app feedback, modals, and drawers.

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

Actions map directly to `/pages/users/api/list`, `/detail`, `/create`, `/update`, and `/remove`.

## Core Patterns

### Routes and page entries

```tsx
import { Routes, lazy, useApp } from '@faasjs/ant-design'
import { Button, Space } from 'antd'

export function Pages() {
  return <Routes routes={[{ path: 'users', page: lazy(() => import('./users')) }]} />
}

export default function UsersPage() {
  const { setDrawerProps } = useApp()

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button
        type="primary"
        onClick={() =>
          setDrawerProps({ open: true, title: 'Create User', width: 720, children: <UserForm /> })
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

- Use `Table.faasData` for list fetches and `Description.faasData` for detail fetches.
- Reuse `items` across list, detail, and form; add surface-specific renderers only when presentation truly differs.
- Open detail/edit in drawers when users should keep list context visible.
- Use modal confirmations for destructive actions.
- After create, update, or delete, intentionally close the overlay and refresh or invalidate the affected surface.

```tsx
<Table
  rowKey="id"
  items={[...items, { id: 'actions', tableRender: (_, row) => <UserActions row={row} /> }]}
  faasData={{ action: '/pages/users/api/list' }}
/>
```

### Create and update forms

```tsx
import { Form, useApp } from '@faasjs/ant-design'

export function UserForm(props: {
  id?: number
  initialValues?: Record<string, any>
  onSuccess?: () => void
}) {
  const { message, notification, setDrawerProps } = useApp()

  return (
    <Form
      initialValues={props.initialValues}
      items={useUserItems()}
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

### Delete and dangerous actions

```tsx
const { message, notification, setModalProps } = useApp()

setModalProps({
  open: true,
  title: 'Delete User',
  children: 'Please confirm the deletion.',
  onOk: async () => {
    try {
      await faas('/pages/users/api/remove', { id })
      message.success('User deleted')
      setModalProps({ open: false })
      onSuccess?.()
    } catch (error: any) {
      notification.error({ message: 'Delete failed', description: error?.message })
    }
  },
})
```

## Preferred Components

- `Title`: page or section headings; prefer over ad hoc heading markup in app surfaces.
- `Tabs`: tabbed business views that should share the FaasJS/Ant Design look.
- `Link`: navigation that should integrate with the configured router.
- `Blank`: empty states instead of hand-written placeholder blocks.
- `Loading`: explicit loading surfaces outside component-owned `faasData` lifecycles.
- `ConfigProvider`: app-level theme, locale, or client config.
- `ErrorBoundary`: page or feature boundaries where errors should not take down the whole app.
- `FaasDataWrapper` / `withFaasData`: only when wrapper composition or fixed integration boundaries help.
- `useThemeToken`: custom layout tokens; do not hardcode common spacing, radius, or colors.
- `useModal` / `useDrawer`: only for intentionally isolated local instances; otherwise use shared `useApp()` overlays.

## Rules

1. Follow the `pages/`, `components/`, `hooks/`, `api/` structure and routing-mapping for feature-local APIs.
2. Use `App` once as the application shell; do not scatter independent app shells through features.
3. Treat `items` as the source of truth for business fields across `Form`, `Description`, and `Table`.
4. Prefer FaasJS wrappers over raw Ant Design primitives when the wrapper fits common CRUD, loading, empty, route, or feedback surfaces.
5. If custom layout is necessary, read visual values from `useThemeToken()` instead of hardcoding tokens.
6. Use `Form.faas`, `Table.faasData`, `Description.faasData`, and `faas` for straightforward request lifecycles before custom loading/effect plumbing.
7. Use `useApp()` for shared feedback and overlays; prefer drawers for in-context create/edit/detail and modals for confirmations.
8. Promote repeated custom field behavior into `extendTypes`; keep one-off customization on the item itself.
9. Use `formRender`, `descriptionRender`, or `tableRender` only when a field truly differs by surface; do not fork fake field ids.

## Review Checklist

- feature layout and action paths follow conventions
- routes use `Routes` and `lazy`
- page entry composes feature components instead of containing all logic inline
- shared `items` metadata drives `Form`, `Description`, and `Table`
- wrappers and `faas`/`faasData` cover straightforward request flows
- create/update/delete flows provide feedback and refresh, close, or invalidate intentionally
- custom layout uses `useThemeToken`; repeated field behavior uses `extendTypes`
