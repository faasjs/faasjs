# Project Config Guide

Use for `tsconfig.json`, `vite.config.ts`, and shared workspace tooling config.

## Default Workflow

1. Start from `@faasjs/types/tsconfig/*` instead of hand-writing a TypeScript baseline.
2. Keep local `tsconfig.json` focused on project-specific `types`, `include`, `exclude`, `baseUrl`, and `paths`.
3. Start from `viteConfig` for standard FaasJS React + local server apps.
4. Keep local `vite.config.ts` focused on runtime plugins, aliases, server options, tests, and build behavior.
5. Reuse `oxfmtConfig` and `oxlintConfig` from `@faasjs/dev`; extend shared config instead of replacing it.

## TypeScript Rules

- Use `@faasjs/types/tsconfig/build.json` for most Vite apps and packages.
- Use `@faasjs/types/tsconfig/base.json` for non-React TypeScript apps.
- Use `@faasjs/types/tsconfig/react.json` only when a React project needs JSX defaults without build-oriented settings.
- Do not duplicate strict mode, JSX, module resolution, or other shared baseline settings unless intentionally changing behavior.
- Prefer explicit `.json` preset paths because generated starters use them.

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

## Vite Rules

- Import `defineConfig` from `vite-plus` when using `fmt` or `lint`.
- Prefer `viteConfig` from `@faasjs/dev` when the standard stack fits.
- For local differences, spread the shared config and add only the delta.
- In mixed Node + UI tests, put UI tests in a dedicated `test.projects` entry with `environment: 'jsdom'`.
- Treat `*.test.tsx` as UI tests; use `*.ui.test.ts` only for UI tests without TSX syntax.
- Put `*.types.test.ts(x)` files in a dedicated `types` project and exclude them from runtime projects.
- Keep PG-backed tests in the main Node runtime project unless setup must be isolated; then use a node-scoped project such as `node-pg`.

```ts
import { viteConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  ...viteConfig,
  server: {
    ...viteConfig.server,
    port: 3000,
  },
})
```

Manual composition is only for projects that cannot use `viteConfig` directly:

```ts
import { oxfmtConfig, oxlintConfig, viteFaasJsServer } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [react(), viteFaasJsServer()],
  resolve: { tsconfigPaths: true },
  fmt: oxfmtConfig,
  lint: oxlintConfig,
})
```

## Alias Rules

- Read `tsconfig.json` and extended configs before choosing import paths.
- Use aliases already defined in `compilerOptions.paths`; keep short relative imports for nearby files.
- Prefer package imports such as `@faasjs/core` over long relative imports into another package.
- Do not introduce an alias unless TypeScript and the runtime or bundler resolver are configured in the same change.
- In FaasJS workspaces, `resolve.tsconfigPaths` in `vite.config.ts` is the preferred runtime support for path aliases.

## Review Checklist

- config inherits shared FaasJS presets where possible
- local overrides only show project-specific behavior
- `vite-plus` is used when `fmt` or `lint` is configured
- shared `viteConfig`, `oxfmtConfig`, and `oxlintConfig` are extended rather than copied
- UI and type tests are isolated into the right Vitest projects when present
- imports follow existing aliases and runtime resolver support
