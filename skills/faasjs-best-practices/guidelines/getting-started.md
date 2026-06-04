# Getting Started Guide

Use this guide when starting a new FaasJS project or onboarding a new developer to an existing FaasJS codebase. It walks through the full setup, first feature, and daily workflow so both humans and AI coding agents can get productive quickly.

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. It gives projects a chef-selected main path instead of asking every team to assemble its own framework from independent tools.

## Prerequisites

Before starting, make sure your environment meets these requirements:

- **Node.js** >= 26.x — FaasJS relies on modern Node features including native TypeScript module loading.
- **npm** >= 9.x — used for dependency management and scaffolding.
- **PostgreSQL** >= 14.x — FaasJS uses PostgreSQL as its relational data store (via `@faasjs/pg`). A running local instance or Docker container is required for database features and integration tests.
- **Basic TypeScript knowledge** — FaasJS is TypeScript-first. You should be comfortable with types, interfaces, and module imports.

Verify your environment:

```bash
node --version   # >= 26.x
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

| Template          | Description                                                                                                      | When to use                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `admin` (default) | Full admin panel starter with React, Ant Design UI, PostgreSQL integration, and a ready-to-copy users CRUD slice | Back-office systems, internal tools, SaaS dashboards, admin panels |
| `minimal`         | Lighter starter with React and minimal configuration                                                             | Simple APIs, BFF layers, or when you want to build UI from scratch |

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
    features/              # Feature-owned UI, APIs, hooks, and tests
      users/               # Example feature: users CRUD
        index.tsx          # Feature UI entry
        api/
          list.api.ts      # POST /features/users/api/list
          create.api.ts    # POST /features/users/api/create
          detail.api.ts    # POST /features/users/api/detail
          update.api.ts    # POST /features/users/api/update
          remove.api.ts    # POST /features/users/api/remove
          __tests__/       # API tests
    db/
      tables/
        <table_name.ts>  # PostgreSQL table type declarations (declaration merging on `Tables`)
      migrations/          # Database migration files (timestamped)
        20250101000000_create_users.ts
  faas.yaml                # (optional) Root-level config overrides
  tsconfig.json            # TypeScript configuration
  vite.config.ts           # Vite + Vitest configuration
  package.json
```

### Key directories

| Directory            | Purpose                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/`      | Feature-owned UI, APIs, hooks, components, jobs, CLI tools, and tests. Each feature gets its own subdirectory with folders such as `components/`, `hooks/`, and `api/`. |
| `src/types/`         | Type declaration files, including `@faasjs/pg` table type augmentations.                                                                                                |
| `src/db/migrations/` | Timestamped database migration files. Created and managed with the `faasjs-pg` CLI.                                                                                     |

### Key configuration files

| File             | Purpose                                                                   | See                                         |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------- |
| `src/faas.yaml`  | Runtime configuration: server root, base path, staging overrides, plugins | [faas.yaml Specification](./faas-yaml.md)   |
| `tsconfig.json`  | TypeScript config, extends `@faasjs/types/tsconfig/*` presets             | [Project Config Guide](./project-config.md) |
| `vite.config.ts` | Vite/Vitest config, uses `viteConfig` from `@faasjs/dev`                  | [Project Config Guide](./project-config.md) |

### Zero-Mapping routing

API routes map directly to file paths under `src/`. No routing registry needed.

| File                                   | Route                               |
| -------------------------------------- | ----------------------------------- |
| `src/features/todo/api/list.api.ts`    | `POST /features/todo/api/list`      |
| `src/features/todo/api/index.api.ts`   | `POST /features/todo/api`           |
| `src/features/todo/api/default.api.ts` | Fallback for `/features/todo/api/*` |

See the [Routing Mapping Specification](./routing-mapping.md) for the full route resolution order.

## Your First Feature

FaasJS features follow a complete vertical slice pattern: database migration → table types → API endpoints → feature UI → tests. Below is a quick overview; for full code examples and patterns, read the [CRUD Patterns Guide](./crud-patterns.md).

### Quick Walkthrough

**Step 1: Database migration** — Create a timestamped migration with `npx faasjs-pg new <name>`, define the table with `SchemaBuilder`/`TableBuilder`, run with `npx faasjs-pg migrate`. See [PG Schema and Migrations Guide](./pg-schema-and-migrations.md).

**Step 2: Table types** — Add declaration merging on `Tables` in `src/db/tables/<table_name>.ts`. See [PG Table Types Guide](./pg-table-types.md).

**Step 3: API endpoints** — Create five `.api.ts` files (`list`, `detail`, `create`, `update`, `remove`) under `src/features/<feature>/api/`, each with inline Zod schema + handler. See [defineApi Guide](./define-api.md) and [CRUD Patterns Guide](./crud-patterns.md).

**Step 4: Frontend page** — Create shared `use<Feature>Items` hook, then compose `Table.faasData` (list), `Description.faasData` (detail), `Form.faas` (create/edit), and `faas` + modal (delete). See [Ant Design Guide](./ant-design.md), [React Guide](./react.md), and [React Data Fetching Guide](./react-data-fetching.md).

**Step 5: Tests** — Place API tests under `api/__tests__/` using `testApi` from `@faasjs/dev`. See [Testing Guide](./testing.md) and [CRUD Patterns Guide](./crud-patterns.md).

**Step 6: Type generation** — After creating/modifying `.api.ts` files, run `npx faas types` to update `src/.faasjs/types.d.ts`. Then run `vp test` to verify.

The `admin` template also includes a users slice with the same pattern — copy it as a reference. See the [Application Slices Guide](./application-slices.md) for the recommended slice layout.

## Key Concepts

### `defineApi` and endpoint definition

Every API endpoint is a file that default-exports `defineApi(...)`. The `schema` field uses Zod for input validation, and the `handler` receives typed `params`.

```ts
import { defineApi, HttpError } from '@faasjs/core'
import { z } from '@faasjs/utils'

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

API file paths map directly to request paths — no routing configuration needed. A file at `src/features/todos/api/list.api.ts` responds to `POST /features/todos/api/list`. See the [Routing Mapping Specification](./routing-mapping.md) for the full resolution order.

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

See the [faas.yaml Specification](./faas-yaml.md) for the full spec.

### `@faasjs/ant-design` components

The `@faasjs/ant-design` package provides business UI wrappers that handle loading, error, and data-fetching state:

| Component              | Purpose                                                                |
| ---------------------- | ---------------------------------------------------------------------- |
| `Table.faasData`       | Server-driven list with automatic re-fetch on params change            |
| `Form.faas`            | Form submission with built-in loading, validation, and feedback        |
| `Description.faasData` | Detail view with loading and error states                              |
| `useApp()`             | Access to `message`, `notification`, `setDrawerProps`, `setModalProps` |

See the [Ant Design Guide](./ant-design.md) for component patterns.

### `useFaas` / `faas` data fetching

| API                                | When to use                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `useFaas(action, params, options)` | Component-owned request state with loading, error, debounce, polling, and reload |
| `faas(action, params)`             | Imperative one-off requests (form submit, delete)                                |
| `Form.faas`                        | Form submissions (preferred over raw `faas`)                                     |

See the [React Data Fetching Guide](./react-data-fetching.md) for lifecycle controls and patterns.

### Plugin mechanism

Plugins inject cross-cutting concerns (auth, tenant context, request metadata) into the request lifecycle. They are configured in `faas.yaml` under the `plugins` key and can extend the `defineApi` handler context with typed fields.

See the [Plugin Specification](./plugin.md) for plugin authoring.

## Development Workflow

The FaasJS toolchain uses `vp` (Vite Plus) as the primary entry point for development tasks.

| Command                    | Purpose                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `vp dev`                   | Start the development server with hot reload                 |
| `vp test`                  | Run all tests with Vitest                                    |
| `vp test <pattern>`        | Run tests matching a file-name pattern                       |
| `vp check --fix`           | Run linting and formatting (oxlint + oxfmt)                  |
| `npx faas types`           | Regenerate API type declarations in `src/.faasjs/types.d.ts` |
| `npx faasjs-pg migrate`    | Run pending database migrations                              |
| `npx faasjs-pg new <name>` | Create a new timestamped migration file                      |

### Daily iteration loop

1. Start the dev server: `vp dev`
2. Edit API files (`*.api.ts`) and feature UI (`*.tsx`)
3. After creating, renaming, or moving `.api.ts` files, regenerate types: `npx faas types`
4. Run focused tests: `vp test src/features/todos/api/__tests__/list.test.ts`
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

| Guide                                                           | What it covers                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| [Application Slices Guide](./application-slices.md)             | Vertical feature structure and recommended layout            |
| [CRUD Patterns Guide](./crud-patterns.md)                       | Complete CRUD implementation from API to feature UI          |
| [defineApi Guide](./define-api.md)                              | API endpoint schema, validation, and error handling          |
| [Ant Design Guide](./ant-design.md)                             | Page structure, routes, CRUD composition, and UI feedback    |
| [React Data Fetching Guide](./react-data-fetching.md)           | `useFaas`, `faas`, lifecycle controls, polling, and retry    |
| [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) | Database migration authoring rules                           |
| [PG Table Types Guide](./pg-table-types.md)                     | Declaration merging on `Tables` for type-safe queries        |
| [PG Query Builder and Raw SQL Guide](./pg-query-builder.md)     | Query building with `@faasjs/pg`                             |
| [Testing Guide](./testing.md)                                   | Testing principles and practices                             |
| [React Testing Guide](./react-testing.md)                       | React component and request-flow testing                     |
| [PG Testing Guide](./pg-testing.md)                             | PostgreSQL integration testing                               |
| [CLI and Tooling Guide](./cli-and-tooling.md)                   | All CLI commands, environment variables, and troubleshooting |
| [Project Config Guide](./project-config.md)                     | TypeScript, Vite, and tooling configuration                  |
| [File Conventions](./file-conventions.md)                       | File placement and naming conventions                        |
| [Jobs Guide](./jobs.md)                                         | Background jobs with `@faasjs/jobs`                          |
| [Logger Guide](./logger.md)                                     | Logging patterns and log levels                              |
| [Code Comments Guide](./code-comments.md)                       | JSDoc and comment conventions                                |
| [faas.yaml Specification](./faas-yaml.md)                       | Full faas.yaml configuration reference                       |
| [Routing Mapping Specification](./routing-mapping.md)           | Zero-Mapping route resolution                                |
| [Plugin Specification](./plugin.md)                             | Plugin authoring and configuration                           |
| [Http Protocol Specification](./http-protocol.md)               | HTTP request/response protocol details                       |
