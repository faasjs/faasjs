# CLI and Tooling Guide

Use this guide when running CLI commands, troubleshooting command errors, or choosing the right tool for the task. It is a quick-reference for the FaasJS toolchain to reduce command-execution mistakes.

## Default Workflow

1. Install dependencies with `npm install` before running any FaasJS commands.
2. After creating, renaming, or moving a `.api.ts` file, run `faas types` to regenerate type declarations.
3. Use `vp check --fix` for code formatting and linting before committing.
4. Use `vp test` as the default test runner; narrow to `vp test <pattern>` for focused runs.
5. Run database migrations through `faasjs-pg migrate` when a migration is pending.
6. When a command is unavailable, fall back to `npx <command>` and check that `node_modules` is present.

## faas CLI

Provided by `@faasjs/dev` as the `faas` binary (`faas.mjs`). It has two subcommands: `run` and `types`.

| Command | Description |
|---|---|
| `faas run <file>` | Run a TypeScript file with FaasJS Node module hooks preloaded |
| `faas run <file> --root <path>` | Specify project root to resolve `<file>` (default: `process.cwd()`) |
| `faas types` | Generate API type declarations to `src/.faasjs/types.d.ts` |
| `faas types --root <path>` | Specify project root for type generation |

Global options:
- `-h, --help` — Show help text.
- `-v, --version` — Print the `@faasjs/dev` version.

> **Run details**: `faas run` resolves `@faasjs/node-utils/register-hooks` and spawns a child Node process with `--import` so the target script gets a normal `process.argv`.

> **Type generation details**: `faas types` scans `src/` for `.api.ts` files, converts filenames into routes, and writes `src/.faasjs/types.d.ts`. It skips `.faasjs` and `node_modules` directories. Only `.api.ts` files and `faas.yaml` changes trigger type regeneration (see `isTypegenInputFile` in `@faasjs/dev`).

## Vite Plus / vp

Provided by the `vite-plus` package. It is the development and build tooling layer on top of Vite and Vitest.

| Command | Description |
|---|---|
| `vp check --fix` | Run code checking (linting) and formatting fixes via oxlint and oxfmt |
| `vp test` | Run all tests with Vitest |
| `vp test <pattern>` | Run tests matching a file-name pattern |
| `vp test --watch` | Run tests in watch mode |
| `vp dev` | Start the development server |

Common combinations:
```bash
# Run checks and tests before handoff
vp check --fix && vp test

# Run a specific test file
vp test src/pages/users/api/__tests__/list.test.ts

# Run tests matching a pattern with watch
vp test list --watch

# Run tests with a specific log level
FaasLog=info vp test

# Start dev server on a custom port (configured in vite.config.ts)
vp dev
```

## Project Creation

Use `create-faas-app` to scaffold new projects.

```bash
npx create-faas-app --name <project-name>
```

Options:
- `--name <name>` — Project folder name.
- `--template <template>` — Template name (default: `admin`).

Available templates:
- `admin` (default) — Recommended React + Ant Design + PostgreSQL starter.
- `minimal` — Lighter React starter.

After scaffolding, the script automatically runs:
1. `npm install` — Installs dependencies.
2. `npm run test` — Runs the initial test suite to verify the setup.

To run these steps manually after creation:
```bash
cd <project-name>
npm install
npx faas types
```

## Migration Commands

Provided by `@faasjs/pg` as the `faasjs-pg` binary.

| Command | Description |
|---|---|
| `faasjs-pg new <name>` | Create a new timestamped migration file in `migrations/` |
| `faasjs-pg status` | Show the status of all migrations |
| `faasjs-pg migrate` | Run all pending migrations |
| `faasjs-pg up` | Run the next pending migration |
| `faasjs-pg down` | Roll back the latest applied migration |

Requirements:
- `DATABASE_URL` environment variable must be set for `status`, `migrate`, `up`, and `down`.
- Migration files live in `./migrations` by default.
- Migration file naming convention: `<timestamp>-<name>.ts` (generated automatically by `faasjs-pg new`).
- See [PG Schema and Migrations Guide](./pg-schema-and-migrations.md) for migration authoring rules.

Example:
```bash
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg migrate
DATABASE_URL=postgres://localhost:5432/myapp npx faasjs-pg new add_users_table
```

## Type Generation Workflow

Keep type declarations in sync with your API routes:

1. After **creating**, **renaming**, or **moving** a `.api.ts` file, run:

   ```bash
   npx faas types
   ```

2. The generated file is written to `src/.faasjs/types.d.ts`.

3. The output declares a `FaasActions` interface via module augmentation on `@faasjs/types`, providing typed `InferFaasAction` and `InferFaasApi` for every route.

4. `faas types` is idempotent: it compares the generated content against the existing file and only writes when something changed.

5. For type generation from code (e.g., in a script), import `generateFaasTypes` from `@faasjs/dev`:

   ```ts
   import { generateFaasTypes } from '@faasjs/dev'

   const result = await generateFaasTypes({ root: process.cwd() })
   console.log(result.output, result.routeCount)
   ```

## Testing Commands

| Command | Description |
|---|---|
| `vp test` | Run the full test suite |
| `vp test <pattern>` | Run tests matching a file-name pattern (e.g., `vp test list` runs `*list*`) |
| `vp test --watch` | Re-run tests on file changes |
| `FaasLog=info vp test` | Run tests with a specific log verbosity |

See [Testing Guide](./testing.md) for testing principles and [Project Config Guide](./project-config.md) for Vitest project configuration.

## Common Command Errors and Recovery

### `faas: command not found`
- **Check**: `npx faas --version` or `npx @faasjs/dev --version`
- **Recovery**: Ensure `@faasjs/dev` is installed: `npm install @faasjs/dev`
- **Root cause**: The `faas` binary is defined in `@faasjs/dev`, not as a global command.

### `vp: command not found`
- **Check**: `npx vp --version`
- **Recovery**: Ensure `vite-plus` is installed: `npm install vite-plus`
- **Root cause**: The `vp` binary is provided by `vite-plus`.

### `faas types` fails
- **Check**: Does `src/faas.yaml` exist? Is the YAML valid?
- **Check**: Does `src/` contain at least one `.api.ts` file?
- **Recovery**: Run `npx faas types --root .` if outside the project root.
- **See**: [faas.yaml Specification](../locales/en/specs/faas-yaml.md)

### `faasjs-pg` commands fail
- **Check**: Is `DATABASE_URL` set? `echo $DATABASE_URL`
- **Check**: Is the database reachable? `psql $DATABASE_URL -c 'SELECT 1'`
- **Recovery**: Prepend `DATABASE_URL=postgres://...` or set it in `.env`.
- **Root cause**: All `faasjs-pg` commands except `new` require a live database connection.

### Tests fail
- **Check**: Are dependencies installed? `npm ls @faasjs/dev vite-plus vitest`
- **Check**: Does the project have a valid `vitest.config.ts` or `vite.config.ts`?
- **Check**: Are environment variables (e.g., `DATABASE_URL`) available for integration tests?
- **Recovery**: Run a focused test first: `vp test src/specific/test.ts`
- **See**: [Project Config Guide](./project-config.md) for Vite/Vitest configuration.

## Environment Variables and Configuration

### FaasJS runtime
| Variable | Description | Default |
|---|---|---|
| `FaasEnv` | Active staging name used by `faas.yaml` config loading | `development` |
| `FaasLog` | Minimum log level (`debug`, `info`, `warn`, `error`) | `info` |
| `FaasLogMode` | Log output style (`plain`, `pretty`) | auto-detected |
| `FaasLogSize` | Truncation threshold for long non-error logs (bytes) | platform-dependent |
| `FaasLogTransport` | Enable or disable shared log transport forwarding | `true` |

### Database
| Variable | Description | Required By |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `faasjs-pg` CLI, `@faasjs/pg` client bootstrap, `@faasjs/pg-dev` test plugin |

### Example usage
```bash
# Run tests with debug logging
FaasLog=debug vp test

# Run migrations against a specific database
DATABASE_URL=postgres://user:pass@localhost:5432/myapp npx faasjs-pg migrate

# Run type generation for a specific project root
npx faas types --root /path/to/project
```

## Key Configuration Files

| File | Purpose |
|---|---|
| `faas.yaml` | Runtime configuration: server root, base path, staging overrides, plugins |
| `tsconfig.json` | TypeScript configuration, extends `@faasjs/types/tsconfig/*` presets |
| `vite.config.ts` | Vite/Vitest configuration, uses `viteConfig` from `@faasjs/dev` |
| `.env` | Environment variable overrides for local development |

## Rules

1. **Run `faas types` after every `.api.ts` change.** Creating, renaming, or moving API files without regenerating types will cause type errors in callers.
2. **Prefer `vp check --fix` over manual formatting.** It uses oxlint and oxfmt through vite-plus shared configs.
3. **Prefer `vp test` over direct `vitest` calls.** It uses the project's `vite.config.ts` which includes all necessary plugins and aliases.
4. **Use `npx` when the binary is not globally installed.** Both `faas` and `vp` are local to the project's `node_modules`.
5. **Set `DATABASE_URL` before running `faasjs-pg` commands.** All operations except `new` require a live connection.
6. **Keep migration timestamps unique.** The `faasjs-pg new` command uses ISO timestamps; do not hand-edit filenames to avoid ordering conflicts.
7. **Do not edit `src/.faasjs/types.d.ts` manually.** It is regenerated by `faas types` and any manual changes will be overwritten.
8. **Use `FaasLog` verbosity for debugging instead of changing log call sites.** The logger respects `FaasLog` at runtime.

## Review Checklist

- `.api.ts` changes are followed by `faas types` (or a recorded reason)
- `faas.yaml` is valid YAML and follows the [faas.yaml specification](../locales/en/specs/faas-yaml.md)
- `vp check --fix` passes before commit
- `vp test` passes (or a recorded blocker + narrower validation that did run)
- `DATABASE_URL` is set before running `faasjs-pg` migration commands
- migration files are in `migrations/` and follow timestamped naming
- `src/.faasjs/types.d.ts` is not hand-edited
- `npx` prefix is used when binaries are not globally installed
- environment variables (`FaasEnv`, `FaasLog`, `DATABASE_URL`) are documented or obvious per project
