# 项目配置指南

当你创建或评审 FaasJS 项目的 `tsconfig.json`、`vite.config.ts` 或共享工作区工具配置时，请使用这份指南。

## 适用场景

- 初始化一个新的 FaasJS 应用或 package
- 精简已有的 `tsconfig.json`
- 精简已有的 `vite.config.ts`
- 判断项目应该继承框架默认配置，还是定义本地工具规则
- 评审配置文件是否重复声明了 FaasJS 已经提供的设置

## 默认工作流

1. 从 `@faasjs/types/tsconfig/*` 提供的共享 TypeScript 预设开始。
2. 让本地 `tsconfig.json` 只关注项目特有的 `types`、`include`、`exclude` 和 alias。
3. 如果项目采用标准的 FaasJS React + 本地 server 组合，优先从 `viteConfig` 开始。
4. 让本地 `vite.config.ts` 只关注运行时插件和项目行为。
5. 复用 `@faasjs/dev` 中的 `oxfmtConfig` 与 `oxlintConfig`，不要重复复制公共规则。
6. 需要调整时，优先扩展共享配置，而不是整份替换。

## 规则

### 1. 优先使用共享 TypeScript 预设

- 当 `@faasjs/types` 已经提供共享基线时，不要手写完整的 TypeScript 基础配置。
- 对大多数基于 Vite 创建的 FaasJS 应用（包括 `create-faas-app` 生成的 starter），使用 `@faasjs/types/tsconfig/build.json`。
- 对非 React 的 TypeScript 应用，使用 `@faasjs/types/tsconfig/base.json`。
- 如果 React 项目只需要 JSX 默认配置，而不需要面向构建的 module / declaration 设置，则使用 `@faasjs/types/tsconfig/react.json`。
- 不带扩展名的 `@faasjs/types/tsconfig/*` 路径依然可用，但显式 `.json` 路径与生成模板保持一致，也更不容易产生歧义。

React 应用示例：

```json
{
  "extends": "@faasjs/types/tsconfig/build.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

非 React 应用示例：

```json
{
  "extends": "@faasjs/types/tsconfig/base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

Package 示例：

```json
{
  "extends": "@faasjs/types/tsconfig/build.json"
}
```

### 2. 保持本地 tsconfig 覆盖项最小化

- 本地 `compilerOptions` 应只包含项目特有的补充项。
- 合理的本地补充包括 `types`、`paths`、`baseUrl`、`include` 和 `exclude`。
- 除非项目确实需要不同的行为，否则不要重复声明 strict mode、JSX、module resolution 或其他共享基线设置。

优先这样写：

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

避免这样写：

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

### 3. 让 Vite 配置聚焦于应用行为

- 如果项目符合标准 FaasJS React 结构，优先把 `@faasjs/dev` 的 `viteConfig` 当作基础预设。
- `vite.config.ts` 应定义项目运行时行为，例如 plugins、aliases、server 选项、tests 和 build 设置。
- 共享的格式化与 lint 规则应来自 `@faasjs/dev`。
- 使用 `fmt` 和 `lint` 时，`defineConfig` 应来自 `vite-plus`，而不是 `vite`。
- 当一个项目同时包含 Node 测试和 UI 测试时，把 UI 测试放进单独的 `test.projects` 项。`*.test.tsx` 按 UI 测试处理，而 `*.ui.test.ts` 只保留给那些不使用 TSX 语法的 UI 测试，而不是全局设置 `environment: 'jsdom'`。

预设示例：

```ts
import { viteConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

const tests = ['src/**/*.test.ts']
const uiTests = ['src/**/*.test.tsx', 'src/**/*.ui.test.ts']

export default defineConfig({
  ...viteConfig,
  test: {
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: tests,
          exclude: uiTests,
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
        },
      },
    ],
  },
})
```

手动组合示例：

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

### 4. 扩展共享 Vite 规则，而不是整体复制

- 如果项目只需要一两个本地差异，就展开 `viteConfig` 或共享的 lint / format 配置，并只增加增量部分。
- 不要把整份 FaasJS 共享配置复制进每个应用。

示例：

```ts
import { viteConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

const tests = ['src/**/*.test.ts']
const uiTests = ['src/**/*.test.tsx', 'src/**/*.ui.test.ts']

export default defineConfig({
  ...viteConfig,
  server: {
    ...viteConfig.server,
    port: 3000,
  },
  test: {
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: tests,
          exclude: uiTests,
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
        },
      },
    ],
  },
})
```

如果只有 lint 或 format 不同，也可以直接扩展 `oxfmtConfig` 或 `oxlintConfig`：

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

### 5. 让项目特有意图一眼可见

- 读代码的人应该能快速看出哪些设置来自 FaasJS，哪些是本地决策。
- 共享框架默认值应通过继承获得。
- 本地配置文件应只突出影响当前应用、package 或 workspace 的设置。

### 6. 尊重已有 alias 配置

- 选择导入路径风格前，先阅读 `tsconfig.json` 及其继承链。
- 如果 `compilerOptions.paths` 已定义 alias，就使用这些现有 alias，而不是写很深的相对路径。
- 跨 package 导入时，优先使用 `@faasjs/core`、`@faasjs/react` 之类的 package import，而不是长相对路径。
- 同一功能目录中的相邻文件，优先保持短相对导入。
- 不要引入一个新的 alias，除非 `tsconfig.json` 与运行时或 bundler 解析器都已支持它。
- 在 FaasJS workspace 中，让 `vite.config.ts` 开启 `resolve.tsconfigPaths` 是让 `tsconfig.json` path aliases 在运行时生效的推荐方式。

## 评审清单

- `tsconfig.json` 在可能的情况下继承了 `@faasjs/types` 提供的共享预设
- 本地 TypeScript 覆盖项只保留项目特有需求
- 配置了 `fmt` 或 `lint` 时，`vite.config.ts` 使用的是 `vite-plus`
- `vite.config.ts` 以 `viteConfig` 为起点，或复用了 `@faasjs/dev` 的共享 `fmt` / `lint` 规则
- 配置没有在无明确理由时重复 FaasJS 基线设置
- 当一个项目混合 UI 与 Node 测试时，UI 测试放进单独且使用 `environment: 'jsdom'` 的 project，UI 分组里使用 `*.test.tsx`，以及那些不含 TSX 的 `*.ui.test.ts`
- 本地配置文件让项目特有行为易于辨认
- 导入路径在合适时遵循 `tsconfig.json` 已定义的 alias
- `tsconfig.json` 中定义的 alias 也被运行时或 bundler 支持

## 延伸阅读

- [@faasjs/dev package reference](/doc/dev/)
- [viteConfig](/doc/dev/variables/viteConfig.html)
- [viteFaasJsServer](/doc/dev/functions/viteFaasJsServer.html)
- [@faasjs/types package reference](/doc/types/)
