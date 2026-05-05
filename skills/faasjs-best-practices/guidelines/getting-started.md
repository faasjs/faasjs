# Getting Started Guide

Use this guide when starting a new FaasJS project or onboarding a new developer to an existing FaasJS codebase. It walks through the full setup, first feature, and daily workflow so both humans and AI coding agents can get productive quickly.

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. It gives projects a chef-selected main path instead of asking every team to assemble its own framework from independent tools.

## Prerequisites

Before starting, make sure your environment meets these requirements:

- **Node.js** >= 24.x — FaasJS relies on modern Node features including native TypeScript module loading.
- **npm** >= 9.x — used for dependency management and scaffolding.
- **PostgreSQL** >= 14.x — FaasJS uses PostgreSQL as its relational data store (via `@faasjs/pg`). A running local instance or Docker container is required for database features and integration tests.
- **Basic TypeScript knowledge** — FaasJS is TypeScript-first. You should be comfortable with types, interfaces, and module imports.

Verify your environment:

```bash
node --version   # >= 24.x
npm --version    # >= 9.x
psql --version   # >= 14.x
```

## Creating a New Project

The fastest way to start is with `create-faas-app`.

### Step 1: Scaffold the project

```bash
npx create-faas-app --name my-app
```

This command:
1. Creates a `my-app/` directory
2. Installs all dependencies (`npm install`)
3. Runs the initial test suite to verify the setup

### Step 2: Choose a template

`create-faas-app` offers two templates:

| Template | Description | When to use |
|----------|-------------|-------------|
| `admin` (default) | Full admin panel starter with React, Ant Design pages, PostgreSQL integration, and a ready-to-copy users CRUD slice | Back-office systems, internal tools, SaaS dashboards, admin panels |
| `minimal` | Lighter starter with React and minimal configuration | Simple APIs, BFF layers, or when you want to build UI from scratch |

To use a specific template:

```bash
npx create-faas-app --name my-app --template minimal
```

### Step 3: Enter the project directory

```bash
cd my-app
```

The project is now ready. If you chose the `admin` template, the initial test suite already ran during scaffolding. You can also run it manually:

```bash
npm test
```

See the [CLI and Tooling Guide](./cli-and-tooling.md) for available commands.

## Project Structure Tour

A scaffolded FaasJS project follows a consistent layout. Here is what you will find:

```
my-app/
  src/
    faas.yaml              # Runtime configuration (server root, plugins, staging overrides)
    .faasjs/
      types.d.ts           # Auto-generated API type declarations
    pages/                 # Frontend pages and backend API routes
      index.tsx            # App entry page
      users/               # Example feature: users CRUD
        index.tsx          # Page entry
        api/
          list.api.ts       # POST /pages/users/api/list
          create.api.ts     # POST /pages/users/api/create
          detail.api.ts     # POST /pages/users/api/detail
          update.api.ts     # POST /pages/users/api/update
          remove.api.ts     # POST /pages/users/api/remove
          __tests__/        # API tests
    types/
      faasjs-pg.d.ts       # PostgreSQL table type declarations (declaration merging on `Tables`)
  migrations/              # Database migration files (timestamped)
    20250101000000_create_users.ts
  faas.yaml                # (optional) Root-level config overrides
  tsconfig.json            # TypeScript configuration
  vite.config.ts           # Vite + Vitest configuration
  package.json
```

### Key directories

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Frontend pages as React components and backend API routes as `.api.ts` files. Each feature gets its own subdirectory with `components/`, `hooks/`, and `api/` sub-folders. |
| `src/types/` | Type declaration files, including `@faasjs/pg` table type augmentations. |
| `migrations/` | Timestamped database migration files. Created and managed with the `faasjs-pg` CLI. |

### Key configuration files

| File | Purpose | See |
|------|---------|-----|
| `src/faas.yaml` | Runtime configuration: server root, base path, staging overrides, plugins | [faas.yaml Specification](../locales/en/specs/faas-yaml.md) |
| `tsconfig.json` | TypeScript config, extends `@faasjs/types/tsconfig/*` presets | [Project Config Guide](./project-config.md) |
| `vite.config.ts` | Vite/Vitest config, uses `viteConfig` from `@faasjs/dev` | [Project Config Guide](./project-config.md) |

### Zero-Mapping routing

API routes map directly to file paths under `src/`. No routing registry needed.

| File | Route |
|------|-------|
| `src/pages/todo/api/list.api.ts` | `POST /pages/todo/api/list` |
| `src/pages/todo/api/index.api.ts` | `POST /pages/todo/api` |
| `src/pages/todo/api/default.api.ts` | Fallback for `/pages/todo/*` |

See the [Routing Mapping Specification](../locales/en/specs/routing-mapping.md) for the full route resolution order.

## Your First Feature

This section walks through a complete end-to-end CRUD feature: a Todo list with a PostgreSQL table, five API endpoints, a React frontend page, and tests.

### Step 1: Create a migration

Create a new migration file for the `todos` table:

```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new create_todos
```

This creates a file like `migrations/20250101000001_create_todos.ts`. Open it and define the table:

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

Run the migration:

```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
```

See the [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) for migration authoring rules.

### Step 2: Update table type declarations

Add the `todos` table type in `src/types/faasjs-pg.d.ts`:

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

See the [PG Table Types Guide](./pg-table-types.md) for declaration merging rules.

### Step 3: Create API endpoints

Create five API files under `src/pages/todos/api/`. These follow the [CRUD Patterns Guide](./crud-patterns.md).

#### `src/pages/todos/api/list.api.ts`

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
    // TODO: query database with params.keyword, params.page, params.pageSize
    return {
      rows: [
        { id: 1, title: 'Learn FaasJS', description: 'Build a Todo app', completed: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
      ],
      total: 1,
    }
  },
})
```

#### `src/pages/todos/api/create.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
  }),
  async handler({ params }) {
    // TODO: insert into database and return created record
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
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // TODO: fetch from database by params.id
    const todo = { id: 1, title: 'Learn FaasJS', description: 'Build a Todo app', completed: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' }

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
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  async handler({ params }) {
    // TODO: fetch existing todo, update, and return
    return { id: params.id, ...params }
  },
})
```

#### `src/pages/todos/api/remove.api.ts`

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // TODO: delete from database where id = params.id
    return { success: true }
  },
})
```

See the [defineApi Guide](./define-api.md) for schema validation and error handling rules.

### Step 4: Create the frontend page

Create a shared items hook and a page with a table, create form, and detail view.

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
        <Button type="primary" onClick={() =>
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
        }>
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
                <Button type="link" onClick={() =>
                  setDrawerProps({
                    open: true,
                    title: 'Todo Detail',
                    width: 480,
                    children: <Description<TodoField> items={items} faasData={{ action: '/pages/todos/api/detail', params: { id: row.id } }} />,
                  })
                }>
                  Detail
                </Button>
                <Button type="link" onClick={() =>
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
                            notification.error({ message: 'Update failed', description: error?.message }),
                        }}
                      />
                    ),
                  })
                }>
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

> The `reload()` function above is the table's reload function. In a real component you would capture it from `Table.faasData`'s render-prop or a ref pattern. See the [CRUD Patterns Guide](./crud-patterns.md) and [Ant Design Guide](./ant-design.md) for the full pattern.

See the [Ant Design Guide](./ant-design.md) for page layout and component patterns, and the [React Data Fetching Guide](./react-data-fetching.md) for `useFaas`, `faas`, and lifecycle options.

### Step 5: Add tests

Create API tests under `src/pages/todos/api/__tests__/`. Each test uses `testApi` from `@faasjs/dev`.

```ts
// src/pages/todos/api/__tests__/create.test.ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import createApi from '../create.api'

describe('todos/api/create', () => {
  const handler = testApi(createApi)

  it('creates a todo with valid params', async () => {
    const response = await handler({
      title: 'Learn FaasJS',
      description: 'Build a Todo app',
    })

    expect(response.statusCode).toBe(200)
    expect(response.data?.title).toBe('Learn FaasJS')
  })

  it('returns 400 when title is empty', async () => {
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

  it('returns paginated results', async () => {
    const response = await handler({ page: 1, pageSize: 20 })

    expect(response.statusCode).toBe(200)
    expect(response.data?.rows).toBeDefined()
    expect(response.data?.total).toBeDefined()
  })
})
```

See the [Testing Guide](./testing.md) for testing principles, and the [CRUD Patterns Guide](./crud-patterns.md) for complete API test coverage examples.

### Step 6: Run type generation and tests

After creating the API files, generate type declarations so the frontend gets full type inference:

```bash
npx faas types
```

This updates `src/.faasjs/types.d.ts` with typed routes for all `.api.ts` files.

Run tests to verify everything works:

```bash
vp test
```

The `admin` template also includes a users slice with the same pattern. You can copy it as a reference for your own features. See the [Application Slices Guide](./application-slices.md) for the recommended slice layout.

## Key Concepts

### `defineApi` and endpoint definition

Every API endpoint is a file that default-exports `defineApi(...)`. The `schema` field uses Zod for input validation, and the `handler` receives typed `params`.

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    // params.id is typed as number
    return { id: params.id }
  },
})
```

See the [defineApi Guide](./define-api.md) for detailed rules.

### Zero-Mapping routing

API file paths map directly to request paths — no routing configuration needed. A file at `src/pages/todos/api/list.api.ts` responds to `POST /pages/todos/api/list`. See the [Routing Mapping Specification](../locales/en/specs/routing-mapping.md) for the full resolution order.

### `faas.yaml` configuration hierarchy

Configuration is layered by file location and staging. A `src/faas.yaml` file sets the baseline, and deeper `faas.yaml` files can override settings for specific path scopes. Staging keys (`development`, `production`, etc.) allow environment-specific overrides.

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

See the [faas.yaml Specification](../locales/en/specs/faas-yaml.md) for the full spec.

### `@faasjs/ant-design` components

The `@faasjs/ant-design` package provides business UI wrappers that handle loading, error, and data-fetching state:

| Component | Purpose |
|-----------|---------|
| `Table.faasData` | Server-driven list with automatic re-fetch on params change |
| `Form.faas` | Form submission with built-in loading, validation, and feedback |
| `Description.faasData` | Detail view with loading and error states |
| `useApp()` | Access to `message`, `notification`, `setDrawerProps`, `setModalProps` |

See the [Ant Design Guide](./ant-design.md) for component patterns.

### `useFaas` / `faas` data fetching

| API | When to use |
|-----|-------------|
| `useFaas(action, params, options)` | Component-owned request state with loading, error, debounce, polling, and reload |
| `faas(action, params)` | Imperative one-off requests (form submit, delete) |
| `Form.faas` | Form submissions (preferred over raw `faas`) |

See the [React Data Fetching Guide](./react-data-fetching.md) for lifecycle controls and patterns.

### Plugin mechanism

Plugins inject cross-cutting concerns (auth, tenant context, request metadata) into the request lifecycle. They are configured in `faas.yaml` under the `plugins` key and can extend the `defineApi` handler context with typed fields.

See the [Plugin Specification](../locales/en/specs/plugin.md) for plugin authoring.

## Development Workflow

The FaasJS toolchain uses `vp` (Vite Plus) as the primary entry point for development tasks.

| Command | Purpose |
|---------|---------|
| `vp dev` | Start the development server with hot reload |
| `vp test` | Run all tests with Vitest |
| `vp test <pattern>` | Run tests matching a file-name pattern |
| `vp check --fix` | Run linting and formatting (oxlint + oxfmt) |
| `npx faas types` | Regenerate API type declarations in `src/.faasjs/types.d.ts` |
| `npx faasjs-pg migrate` | Run pending database migrations |
| `npx faasjs-pg new <name>` | Create a new timestamped migration file |

### Daily iteration loop

1. Start the dev server: `vp dev`
2. Edit API files (`*.api.ts`) and frontend pages (`*.tsx`)
3. After creating, renaming, or moving `.api.ts` files, regenerate types: `npx faas types`
4. Run focused tests: `vp test src/pages/todos/api/__tests__/list.test.ts`
5. Before committing: `vp check --fix && vp test`

### Database migrations

```bash
# Create a new migration
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new add_due_date_to_todos

# Check migration status
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg status

# Apply pending migrations
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
```

See the [CLI and Tooling Guide](./cli-and-tooling.md) for all commands and troubleshooting.

## Where to Go Next

Now that you have a working project, explore the detailed guides:

| Guide | What it covers |
|-------|----------------|
| [Application Slices Guide](./application-slices.md) | Vertical feature structure and recommended layout |
| [CRUD Patterns Guide](./crud-patterns.md) | Complete CRUD implementation from API to React page |
| [defineApi Guide](./define-api.md) | API endpoint schema, validation, and error handling |
| [Ant Design Guide](./ant-design.md) | Page structure, routes, CRUD composition, and UI feedback |
| [React Data Fetching Guide](./react-data-fetching.md) | `useFaas`, `faas`, lifecycle controls, polling, and retry |
| [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) | Database migration authoring rules |
| [PG Table Types Guide](./pg-table-types.md) | Declaration merging on `Tables` for type-safe queries |
| [PG Query Builder and Raw SQL Guide](./pg-query-builder.md) | Query building with `@faasjs/pg` |
| [Testing Guide](./testing.md) | Testing principles and practices |
| [React Testing Guide](./react-testing.md) | React component and request-flow testing |
| [PG Testing Guide](./pg-testing.md) | PostgreSQL integration testing |
| [CLI and Tooling Guide](./cli-and-tooling.md) | All CLI commands, environment variables, and troubleshooting |
| [Project Config Guide](./project-config.md) | TypeScript, Vite, and tooling configuration |
| [File Conventions](./file-conventions.md) | File placement and naming conventions |
| [Jobs Guide](./jobs.md) | Background jobs with `@faasjs/jobs` |
| [Logger Guide](./logger.md) | Logging patterns and log levels |
| [Code Comments Guide](./code-comments.md) | JSDoc and comment conventions |
| [faas.yaml Specification](../locales/en/specs/faas-yaml.md) | Full faas.yaml configuration reference |
| [Routing Mapping Specification](../locales/en/specs/routing-mapping.md) | Zero-Mapping route resolution |
| [Plugin Specification](../locales/en/specs/plugin.md) | Plugin authoring and configuration |
| [Http Protocol Specification](../locales/en/specs/http-protocol.md) | HTTP request/response protocol details |
