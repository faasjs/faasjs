# create-faas-app

Create a new FaasJS app from a curated starter template.

FaasJS is optimized for database-driven React business applications. `create-faas-app` gives new projects a working starting point for the official path instead of asking every team to assemble React, API, database, testing, and UI conventions from scratch.

## Quick Start

```bash
npx create-faas-app --name my-faas-app
cd my-faas-app
npm run dev
```

The default template is `admin`, which demonstrates the curated React + Ant Design + PostgreSQL path.

## Templates

### `admin`

Use `admin` for the golden-path FaasJS starter.

```bash
npx create-faas-app --name my-admin --template admin
```

It includes:

- React app structure powered by Vite Plus
- `@faasjs/ant-design` and Ant Design for business UI
- `defineApi` endpoints for typed backend APIs
- a copyable users slice with create, list, detail, update, migration, table types, and API tests
- `@faasjs/pg` for PostgreSQL access and migrations
- `@faasjs/pg-dev` for pg-dev-powered tests
- `.env.example` for local database configuration
- type declarations for PostgreSQL table inference

This is the best starting point for admin panels, internal tools, SaaS dashboards, and other database-driven business applications.

### `minimal`

Use `minimal` when you want a smaller React starter without the database and Ant Design stack.

```bash
npx create-faas-app --name my-minimal-app --template minimal
```

It is useful for learning the core FaasJS runtime, building API-only or BFF-style projects, or adding a custom UI/database path intentionally.

## Recommended Path

Start with `admin` unless you have a specific reason not to. It shows how FaasJS expects complete application slices to fit together:

- UI pages call typed APIs
- APIs validate inputs at system boundaries
- APIs use PostgreSQL through the shared database workflow
- migrations and table types keep data contracts explicit
- tests cover the API and database behavior

FaasJS allows teams to replace parts of the stack, but the templates, docs, and examples optimize this curated path first.

## Auth And Permissions

Authentication and permissions are intentionally not built into FaasJS core because production auth requirements vary by product.

The admin starter includes a small auth plugin demo. Treat it as a plugin pattern that shows how to inject current-user context, protect APIs, and model project-specific permissions. It is not a mandatory framework auth system.

## Next Steps

- Read the FaasJS guide at <https://faasjs.com/guide/>.
- Review the root README for the project direction and package overview.
- Explore runnable templates in <https://github.com/faasjs/faasjs/tree/main/templates>.
- Use the admin starter users slice as the reference for complete UI/API/database/test examples.

## API Docs

- [main](functions/main.md)
