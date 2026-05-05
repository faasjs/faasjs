# CRUD Patterns Guide

Use this guide when implementing or reviewing a standard CRUD feature — list, detail, create, update, delete — in a FaasJS application. It covers the full vertical slice from API endpoints to React pages.

Apply the [Application Slices Guide](./application-slices.md), [Ant Design Guide](./ant-design.md), [defineApi Guide](./define-api.md), and [React Data Fetching Guide](./react-data-fetching.md) for deeper rules. This guide focuses on composing those patterns into a complete CRUD cycle.

## Default Workflow

1. Model business fields as shared `items` metadata in a `use<Feature>Items` hook.
2. Create five API files: `list`, `detail`, `create`, `update`, `remove`.
3. Build the list page with `Table.faasData`, search/filter controls, and action column.
4. Add detail view with `Description.faasData` inside a drawer.
5. Add create/update forms that reuse the same `items` and use `Form.faas`.
6. Add delete with a modal confirmation.
7. Wire mutation feedback (`message.success`, `notification.error`) and surface refresh/close.
8. Add API tests with `testApi` covering success, validation, and error paths.
9. Add React tests with `setMock` covering loading, render, and mutation flows.

## Quick Reference Tables

### API Endpoint Mapping

| Action | API File            | Route                              | Method | Params              |
| ------ | ------------------- | ---------------------------------- | ------ | ------------------- |
| List   | `api/list.api.ts`   | `POST /pages/<feature>/api/list`   | post   | Filters, pagination |
| Detail | `api/detail.api.ts` | `POST /pages/<feature>/api/detail` | post   | `{ id }`            |
| Create | `api/create.api.ts` | `POST /pages/<feature>/api/create` | post   | Business fields     |
| Update | `api/update.api.ts` | `POST /pages/<feature>/api/update` | post   | `{ id, ...fields }` |
| Remove | `api/remove.api.ts` | `POST /pages/<feature>/api/remove` | post   | `{ id }`            |

### File Naming Convention

| Layer      | Convention                                | Example                                  |
| ---------- | ----------------------------------------- | ---------------------------------------- |
| Page entry | `pages/<feature>/index.tsx`               | `pages/users/index.tsx`                  |
| Components | `pages/<feature>/components/*.tsx`        | `pages/users/components/UserTable.tsx`   |
| Hooks      | `pages/<feature>/hooks/*.ts`              | `pages/users/hooks/useUserItems.ts`      |
| APIs       | `pages/<feature>/api/*.api.ts`            | `pages/users/api/list.api.ts`            |
| API tests  | `pages/<feature>/api/__tests__/*.test.ts` | `pages/users/api/__tests__/list.test.ts` |

## Shared Items Pattern

The `items` array is the single source of truth for business fields across `Form`, `Table`, and `Description`. Each item describes one field: its id, label, input type, validation, and optional per-surface renderers.

Define items in a `use<Feature>Items` hook so they stay colocated and reusable.

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

**Rules for items:**

- Keep items in `useConstant` so the array identity is stable across renders.
- Add `tableRender`, `descriptionRender`, or `formRender` only when presentation truly differs per surface.
- For fields that appear on one surface only (like an action column), add them inline on the consuming component instead of polluting shared items.
- Use `extendTypes` for repeated custom field behavior (see [Ant Design Guide](./ant-design.md#core-patterns)).

## List Page Pattern

Use `Table.faasData` for server-driven list fetches. Add search/filter controls in a row above the table and an actions column for detail/edit/delete.

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

### List API

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

### Search / Filter Trigger

- Use `setSearchParams` to trigger `Table.faasData` re-fetch. The table re-fetches automatically when `faasData.params` changes.
- Use `debounce` via the `useFaas` lifecycle instead of custom timers (see [React Data Fetching Guide](./react-data-fetching.md)).
- Keep `keyword` local state for the input and only push to `searchParams` on search submit.

## Detail Pattern

Use `Description.faasData` for detail fetches. Open in a drawer to keep list context visible.

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

### Detail API

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

**Rules for detail:**

- Reuse the same `items` from `use<Feature>Items`.
- For fields that differ on detail, use `descriptionRender` on the item.
- Keep the detail API response shape aligned with the item field ids.

## Create Form Pattern

Use `Form.faas` for form submission with built-in loading, validation, feedback, and error handling.

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

### Create API

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

**Rules for create forms:**

- `Form.faas` handles button loading, validation, and error feedback automatically.
- Use `message.success` for success feedback and `notification.error` for failure feedback.
- Close the drawer/modal on success via `setDrawerProps({ open: false })`.
- Call `props.onSuccess?.()` so the parent can refresh the list.

## Update Form Pattern

Reuse the same `UserForm` component by passing `initialValues` and switching the API action. The form pre-fills data from a detail fetch.

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

### Update API

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

**Rules for update forms:**

- Use the same `UserForm` component for both create and update — the `id` prop determines the mode.
- Fetch current values on the page/component that opens the drawer, then pass them as `initialValues`.
- Make update API fields optional (`z.string().optional()`) so partial updates work.
- Use `Form.faas` `params` function to conditionally include `id` for updates.

## Delete Pattern

Use a modal confirmation for destructive actions. Call `faas` imperatively in the `onOk` handler.

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

### Remove API

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

**Rules for delete:**

- Use `setModalProps` from `useApp()` for modal confirmation.
- Call `faas` imperatively inside the `onOk` handler — not `Form.faas`.
- Always fetch the record first and return `404` if not found.
- On success, close modal, show `message.success`, and call `onSuccess` to refresh the parent.

## Complete CRUD Slice Layout Reference

### Directory Structure

```
src/pages/users/
  index.tsx                          # Page entry: composes UserTable, create button
  components/
    UserTable.tsx                    # Table with faasData, search, action column
    UserForm.tsx                     # Form for create/update (id prop switches mode)
    UserDetail.tsx                   # Description with faasData
    UserActions.tsx                  # Detail / Edit / Delete buttons
  hooks/
    useUserItems.ts                  # Shared items metadata
  api/
    list.api.ts                      # POST /pages/users/api/list
    detail.api.ts                    # POST /pages/users/api/detail
    create.api.ts                    # POST /pages/users/api/create
    update.api.ts                    # POST /pages/users/api/update
    remove.api.ts                    # POST /pages/users/api/remove
    __tests__/
      list.test.ts                   # testApi for list
      detail.test.ts                 # testApi for detail
      create.test.ts                 # testApi for create
      update.test.ts                 # testApi for update
      remove.test.ts                 # testApi for remove
```

### File Count & Responsibility

| File              | Lines (approx) | Responsibility                            |
| ----------------- | -------------- | ----------------------------------------- |
| `index.tsx`       | 30-60          | Page entry, layout, compose components    |
| `UserTable.tsx`   | 40-80          | Table, search, filter, action column      |
| `UserForm.tsx`    | 30-60          | Form items, faas config, feedback         |
| `UserDetail.tsx`  | 15-30          | Description with faasData                 |
| `UserActions.tsx` | 40-70          | Detail/Edit/Delete buttons, modal confirm |
| `useUserItems.ts` | 30-60          | Shared items metadata                     |
| Each `.api.ts`    | 15-40          | Schema, handler, DB query                 |
| Each API test     | 20-50          | testApi, success/error paths              |

## Testing CRUD Endpoints

Use `testApi` from `@faasjs/dev` to test each endpoint. Cover success, validation failure, and expected business errors.

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

**Rules for CRUD tests:**

- Follow the shared [Testing Guide](./testing.md) and [defineApi Guide](./define-api.md).
- For each endpoint, test: success path, validation failure (400), and business errors (404, 409).
- Use `testApi(api)` to get a typed handler.
- Assert both `statusCode` and `data`/`error` shape.
- Place tests under `api/__tests__/` next to the API file.

## Agent Efficiency Tips

The following patterns help AI coding agents generate complete CRUD features 2-3x faster.

### 1. Start with items

```text
Prompt: "Create a `useProductItems` hook with fields: name (required), price (required, positive number), category (select with 3 options), description (textarea), status (select). Store in pages/products/hooks/useProductItems.ts"
```

Items are the foundation. Once items exist, the agent can derive `Table`, `Form`, and `Description` consistently.

### 2. Generate five APIs in one pass

```text
Prompt: "Create 5 API files for products CRUD under pages/products/api/: list, detail, create, update, remove. Follow the defineApi guide. Each should have a Zod schema and handler."
```

Five small `.api.ts` files are faster to generate together than one at a time, and the agent can keep schemas consistent.

### 3. Copy-paste the combined form

The `UserForm` pattern with `id`-based mode switching (create vs update) is reusable. Generate one combined form instead of separate create/update components.

### 4. Generate list + drawer wiring in one go

```text
Prompt: "Create pages/products/index.tsx with a Table.faasData list, search button, create button that opens a drawer with ProductForm, and an actions column with detail/edit/delete. Use the shared items from useProductItems."
```

One prompt covers the page entry, table, drawer wiring, and action column.

### 5. Batch API tests

```text
Prompt: "Create test files for all 5 product APIs under pages/products/api/__tests__/. Each test should cover success and 400/404/409 paths where applicable."
```

One prompt generates all tests with a consistent pattern.

### 6. Use the slice template for new features

When starting a new CRUD feature, create the full directory structure first:

```text
Prompt: "Create a full CRUD slice for orders under pages/orders/. Include: index.tsx, components/ (OrderTable, OrderForm, OrderDetail, OrderActions), hooks/useOrderItems, api/ (list, detail, create, update, remove), and api/__tests__/ for all 5 endpoints."
```

## Rules

1. Use shared `items` in a `use<Feature>Items` hook as the single source of truth for business fields across `Form`, `Table`, and `Description`.
2. Name API files with the CRUD action (`list`, `detail`, `create`, `update`, `remove`) and place them under `<feature>/api/`.
3. Use `Form.faas` for create/update submissions — it handles loading, validation, and error feedback automatically.
4. Use `Table.faasData` for list fetches — it handles loading, error, and re-fetch on params change.
5. Use `Description.faasData` for detail fetches.
6. Use a combined `UserForm` component with an `id` prop to switch between create and update modes.
7. Use `faas` imperatively for delete and other one-off mutations.
8. Close overlays and refresh the affected surface after every mutation.
9. Use `message.success` for success feedback and `notification.error` for failures.
10. Always fetch the resource first in detail, update, and remove endpoints; return `404` when not found.
11. Check for duplicates in create/update endpoints; return `409` on conflict.
12. Place API tests under `api/__tests__/` using `testApi` from `@faasjs/dev`.
13. Keep `items` in `useConstant` so the array identity is stable across renders.
14. Add action columns inline on `Table` items instead of in shared items.
15. Use `setDrawerProps` from `useApp()` for in-context create/edit/detail overlays.
16. Use `setModalProps` from `useApp()` for destructive confirmation modals.

## Review Checklist

- [ ] Shared `use<Feature>Items` hook exists with all business fields
- [ ] Five API files exist: `list.api.ts`, `detail.api.ts`, `create.api.ts`, `update.api.ts`, `remove.api.ts`
- [ ] Each API has a Zod schema defined inline in `defineApi`
- [ ] List API returns `{ rows, total }` shape
- [ ] Detail/update/remove APIs check for existence and return `404` when not found
- [ ] Create/update APIs check for duplicates and return `409` on conflict
- [ ] `Table.faasData` drives the list with search/filter params
- [ ] `Description.faasData` drives the detail view
- [ ] `Form.faas` drives create/update with `id`-based mode switching
- [ ] `faas` + modal confirmation drives delete
- [ ] Mutations provide feedback (`message.success`, `notification.error`)
- [ ] Mutations close overlays and call `onSuccess` to refresh the parent
- [ ] API tests cover success path, 400 (validation), and business errors (404/409)
- [ ] API tests use `testApi` and are placed in `api/__tests__/`
- [ ] Items are wrapped in `useConstant`
- [ ] Action columns are added inline on the `Table` rather than in shared items
- [ ] Drawers are used for create/edit/detail; modals for delete confirmation
- [ ] File structure follows `pages/<feature>/{components/,hooks/,api/}` conventions
