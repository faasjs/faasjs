# Project Config Guide

Use this guide when creating or reviewing a FaasJS project's `tsconfig.json`, `vite.config.ts`, or shared workspace tooling config.

## Use This Guide When

- bootstrapping a new FaasJS app or package
- simplifying an existing `tsconfig.json`
- simplifying an existing `vite.config.ts`
- deciding whether a project should inherit framework defaults or define local tooling rules
- reviewing whether config files duplicate settings that FaasJS already publishes

## Default Workflow

1. Start from the shared TypeScript preset in `@faasjs/types/tsconfig/*`.
2. Keep local `tsconfig.json` focused on project-specific `types`, `include`, `exclude`, and aliases.
3. Keep local `vite.config.ts` focused on runtime plugins and project behavior.
4. Reuse `oxfmtConfig` and `oxlintConfig` from `@faasjs/dev` instead of duplicating common rules.
5. Extend shared config when needed, rather than replacing it wholesale.

## Rules

### 1. Prefer shared TypeScript presets

- Do not hand-write a full TypeScript baseline when `@faasjs/types` already provides the shared one.
- Use `@faasjs/types/tsconfig/build.json` for most FaasJS apps created with Vite, including the `create-faas-app` starters.
- Use `@faasjs/types/tsconfig/base.json` for non-React TypeScript apps.
- Use `@faasjs/types/tsconfig/react.json` when a React project only needs the JSX defaults without the build-oriented module and declaration settings.
- The extensionless `@faasjs/types/tsconfig/*` paths still work, but the explicit `.json` paths match the generated starters and avoid ambiguity.

React app example:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Non-React app example:

```json
{
  "extends": "@faasjs/types/tsconfig/base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Package example:

```json
{
  "extends": "@faasjs/types/tsconfig/build.json"
}
```

### 2. Keep local tsconfig overrides minimal

- Local `compilerOptions` SHOULD only contain project-specific additions.
- Good local additions include `types`, `paths`, `baseUrl`, `include`, and `exclude`.
- Do not duplicate strict-mode, JSX, module resolution, or other shared baseline settings unless the project intentionally needs a different behavior.

Prefer this:

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

Avoid this:

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

### 3. Keep Vite config focused on app behavior

- `vite.config.ts` SHOULD define project runtime behavior such as plugins, aliases, server options, tests, and build settings.
- Shared formatting and lint rules SHOULD come from `@faasjs/dev`.
- When using `fmt` and `lint`, `defineConfig` SHOULD come from `vite-plus`, not `vite`.

Example:

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

### 4. Extend shared Vite rules instead of replacing them

- If the project needs one or two local lint or format differences, spread the shared config and add only the delta.
- Do not copy the entire FaasJS shared config into each app.

Example:

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

### 5. Make project-specific intent obvious

- A reader should be able to tell which settings come from FaasJS and which ones are local decisions.
- Shared framework defaults SHOULD be inherited.
- Local files SHOULD only highlight the settings that affect this specific app, package, or workspace.

### 6. Respect existing alias config

- Read `tsconfig.json` and any config it extends before choosing an import path style.
- If `compilerOptions.paths` defines aliases, use those existing aliases instead of deep relative imports.
- Prefer package imports such as `@faasjs/core` or `@faasjs/react` over long relative imports into another package.
- Keep short relative imports for nearby files in the same feature or directory.
- Do not introduce an alias unless `tsconfig.json` and the runtime or bundler resolver support it.
- In FaasJS workspaces, enabling `resolve.tsconfigPaths` in `vite.config.ts` is the preferred way to make `tsconfig.json` path aliases work at runtime.

## Review Checklist

- `tsconfig.json` extends a shared preset from `@faasjs/types` when possible
- local TypeScript overrides are limited to project-specific needs
- `vite.config.ts` uses `vite-plus` when `fmt` or `lint` is configured
- shared `fmt` and `lint` rules come from `@faasjs/dev`
- the config does not duplicate FaasJS baseline settings without a clear reason
- local config files make project-specific behavior easy to identify
- imports follow aliases already defined in `tsconfig.json` when appropriate
- aliases defined in `tsconfig.json` are also supported by the runtime or bundler

## Read Next

- [@faasjs/dev package reference](../references/packages/dev/README.md)
- [viteFaasJsServer](../references/packages/dev/functions/viteFaasJsServer.md)
- [@faasjs/types package reference](../references/packages/types/README.md)
