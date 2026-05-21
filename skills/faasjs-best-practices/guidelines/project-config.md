# Project Config Guide

Use for `tsconfig.json`, `vite.config.ts`, and shared workspace tooling config in FaasJS projects.

## Applicable Scenarios

- Initializing a new FaasJS app or package
- Simplifying an existing `tsconfig.json`
- Simplifying an existing `vite.config.ts`
- Deciding whether to inherit framework defaults or write local tooling rules
- Reviewing config files for duplicate declarations of FaasJS-provided settings

## Default Workflow

1. Start from `@faasjs/types/tsconfig/*` instead of hand-writing a TypeScript baseline.
2. Keep local `tsconfig.json` focused on project-specific `types`, `include`, `exclude`, `baseUrl`, and `paths`.
3. Start from `viteConfig` for standard FaasJS React + local server apps.
4. Keep local `vite.config.ts` focused on runtime plugins, aliases, server options, tests, and build behavior.
5. Reuse `oxfmtConfig` and `oxlintConfig` from `@faasjs/dev`; extend shared config instead of replacing it.
6. Prefer extending shared config over wholesale replacement when adjustments are needed.

## Rules

### 1. Prefer shared TypeScript presets

- Use `@faasjs/types/tsconfig/build.json` for most Vite apps and packages (including `create-faas-app` starters).
- Use `@faasjs/types/tsconfig/base.json` for non-React TypeScript apps.
- Use `@faasjs/types/tsconfig/react.json` only when a React project needs JSX defaults without build-oriented settings.
- Do not duplicate strict mode, JSX, module resolution, or other shared baseline settings unless intentionally changing behavior.
- Prefer explicit `.json` preset paths because generated starters use them.

React app:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Non-React app:

```json
{
  "extends": "@faasjs/types/tsconfig/base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Package:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json"
}
```

Extension-less paths (e.g. `@faasjs/types/tsconfig/build`) still work, but explicit `.json` paths match generated starter output and reduce ambiguity.

### 2. Keep local tsconfig overrides minimal

Local `compilerOptions` should only add project-specific settings. Do not redeclare `strict`, `jsx`, `moduleResolution`, or other shared baseline values unless intentionally overriding behavior.

Prefer:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Avoid:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

### 3. Let Vite config focus on app behavior

- Import `defineConfig` from `vite-plus` when using `fmt` or `lint`.
- Prefer `viteConfig` from `@faasjs/dev` when the standard stack fits.
- `vite.config.ts` should define project runtime behavior: plugins, aliases, server options, tests, and build settings.
- Shared format and lint rules should come from `@faasjs/dev`.
- In mixed Node + UI tests, use separate `test.projects` entries. Treat `*.test.tsx` as UI tests and `*.ui.test.ts` for UI tests without TSX syntax.
- Put `*.types.test.ts(x)` files in a dedicated `types` project and exclude them from runtime projects. Without this, `src/**/*.test.ts` globs would also match `*.types.test.ts` files, and inherited root-level typecheck config could duplicate runs.
- Keep PG-backed tests in the main Node runtime project unless setup must be isolated; then use a node-scoped project such as `node-pg`.

Example with multi-project Vitest config:

```ts
import { viteConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

const tests = ['src/**/*.test.ts']
const uiTests = ['src/**/*.test.tsx', 'src/**/*.ui.test.ts']
const typeTests = ['src/**/*.types.test.ts', 'src/**/*.types.test.tsx']

export default defineConfig({
  ...viteConfig,
  test: {
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: tests,
          exclude: uiTests.concat(typeTests),
          environment: 'node',
        },
      },
      {
        extends: true as const,
        test: {
          name: 'ui',
          include: uiTests,
          environment: 'jsdom',
          setupFiles: ['vitest.ui.setup.ts'],
          exclude: typeTests,
        },
      },
      {
        extends: true as const,
        test: {
          name: 'types',
          include: typeTests,
          environment: 'node',
          typecheck: {
            enabled: true,
            only: true,
            include: typeTests,
          },
        },
      },
    ],
  },
})
```

Manual composition for projects that cannot use `viteConfig` directly:

```ts
import { viteFaasJsServer, oxfmtConfig, oxlintConfig } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [react(), viteFaasJsServer()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: '0.0.0.0',
  },
  fmt: oxfmtConfig,
  lint: oxlintConfig,
})
```

### 4. Extend shared Vite rules instead of copying

If only one or two local differences are needed, spread the shared config and add only the delta.

For lint/format overrides, extend `oxfmtConfig` or `oxlintConfig`:

```ts
import { oxfmtConfig, oxlintConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    ...oxfmtConfig,
  },
  lint: {
    ...oxlintConfig,
    rules: {
      ...oxlintConfig.rules,
      'no-console': 'warn',
    },
  },
})
```

### 5. Make project-specific intent visible at a glance

- Readers should quickly see which settings come from FaasJS versus which are local decisions.
- Shared framework defaults should come through inheritance.
- Local config should only highlight settings that affect the current app, package, or workspace.

### 6. Respect existing alias configuration

- Read `tsconfig.json` and extended configs before choosing import paths.
- Use aliases already defined in `compilerOptions.paths`; keep short relative imports for nearby files.
- Prefer package imports such as `@faasjs/core` over long relative imports into another package.
- Do not introduce an alias unless TypeScript and the runtime or bundler resolver are configured in the same change.
- In FaasJS workspaces, `resolve.tsconfigPaths` in `vite.config.ts` is the preferred runtime support for path aliases.

## Review Checklist

- `tsconfig.json` inherits shared presets from `@faasjs/types` where possible
- local TypeScript overrides only keep project-specific settings
- `vite-plus` is used when `fmt` or `lint` is configured
- `vite.config.ts` starts from `viteConfig` or reuses shared `fmt`/`lint` rules from `@faasjs/dev`
- config does not duplicate FaasJS baseline settings without reason
- when a project mixes UI and Node tests, UI tests are in a separate project with `environment: 'jsdom'`
- when a project has type tests, they are in a separate `types` project instead of mixed into runtime tests
- local config makes project-specific behavior identifiable
- imports follow existing aliases and runtime resolver support
