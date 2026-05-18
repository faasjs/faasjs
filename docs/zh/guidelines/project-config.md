# 项目配置指南

适用于 FaasJS 项目中的 `tsconfig.json`、`vite.config.ts` 及共享工作区工具配置。

## 适用场景

- 初始化新的 FaasJS 应用或包
- 简化已有的 `tsconfig.json`
- 简化已有的 `vite.config.ts`
- 决定是继承框架默认配置还是编写本地工具规则
- 审查配置文件中是否重复声明了 FaasJS 提供的设置项

## 默认工作流

1. 从 `@faasjs/types/tsconfig/*` 开始，而不是手写 TypeScript 基线配置。
2. 将本地 `tsconfig.json` 保持专注在项目特定的 `types`、`include`、`exclude`、`baseUrl` 和 `paths`。
3. 从 `viteConfig` 开始用于标准的 FaasJS React + 本地服务端应用。
4. 将本地 `vite.config.ts` 保持专注在运行时插件、别名、服务端选项、测试和构建行为。
5. 复用 `@faasjs/dev` 中的 `oxfmtConfig` 和 `oxlintConfig`；扩展共享配置而非替换。
6. 在需要调整时，优先扩展共享配置而不是完全替换。

## 规则

### 1. 优先使用共享的 TypeScript 预设

- 使用 `@faasjs/types/tsconfig/build.json` 用于大多数 Vite 应用和包（包括 `create-faas-app` 启动模板）。
- 使用 `@faasjs/types/tsconfig/base.json` 用于非 React 的 TypeScript 应用。
- 仅在 React 项目需要 JSX 默认值但不需要面向构建的设置时，使用 `@faasjs/types/tsconfig/react.json`。
- 除非有意改变行为，否则不要重复声明严格模式、JSX、模块解析或其他共享基线设置。
- 优先使用显式的 `.json` 预设路径，因为生成的启动模板使用它们。

React 应用：

```json
{
  "extends": "@faasjs/types/tsconfig/build.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

非 React 应用：

```json
{
  "extends": "@faasjs/types/tsconfig/base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
```

包：

```json
{
  "extends": "@faasjs/types/tsconfig/build.json"
}
```

无扩展名的路径（如 `@faasjs/types/tsconfig/build`）仍然可用，但显式的 `.json` 路径与生成的启动模板输出一致，并能减少歧义。

### 2. 保持本地 tsconfig 覆写最小化

本地 `compilerOptions` 应仅添加项目特定的设置。不要重新声明 `strict`、`jsx`、`moduleResolution` 或其他共享基线值，除非有意覆写行为。

推荐：

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

避免：

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

### 3. 让 Vite 配置专注于应用行为

- 在使用 `fmt` 或 `lint` 时，从 `vite-plus` 导入 `defineConfig`。
- 当标准技术栈适用时，优先使用 `@faasjs/dev` 中的 `viteConfig`。
- `vite.config.ts` 应定义项目运行时行为：插件、别名、服务端选项、测试和构建设置。
- 共享的格式和 lint 规则应来自 `@faasjs/dev`。
- 在混合 Node + UI 测试中，使用单独的 `test.projects` 条目。将 `*.test.tsx` 视为 UI 测试，将 `*.ui.test.ts` 用于不使用 TSX 语法的 UI 测试。
- 将 `*.types.test.ts(x)` 文件放在专用的 `types` 项目中，并从运行时项目中排除。否则，`src/**/*.test.ts` 通配符会同时匹配到 `*.types.test.ts` 文件，且继承的根级类型检查配置可能导致重复运行。
- 将 PG 支持的测试保留在主 Node 运行时项目中，除非设置必须隔离；此时使用 node 作用域项目，如 `node-pg`。

带有多个 Vitest 项目的示例：

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

对于无法直接使用 `viteConfig` 的项目，手动组合：

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

### 4. 扩展共享的 Vite 规则而非复制

如果只需要一两个本地差异，展开共享配置并仅添加增量部分。

对于 lint/format 覆写，扩展 `oxfmtConfig` 或 `oxlintConfig`：

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

### 5. 一眼看出项目特定的意图

- 读者应能快速识别哪些设置来自 FaasJS，哪些是本地决策。
- 共享框架默认值应通过继承获得。
- 本地配置应仅突出显示影响当前应用、包或工作区的设置。

### 6. 尊重已有的别名配置

- 在选择导入路径前，先阅读 `tsconfig.json` 及其扩展配置。
- 使用已在 `compilerOptions.paths` 中定义的别名；对附近文件保持短相对导入。
- 优先使用包导入（如 `@faasjs/core`）而非引入另一个包的长相对导入。
- 除非在同一更改中同时配置了 TypeScript 和运行时或打包器解析器，否则不要引入别名。
- 在 FaasJS 工作区中，`vite.config.ts` 中的 `resolve.tsconfigPaths` 是路径别名的首选运行时支持。

## 审查清单

- `tsconfig.json` 在可能的情况下继承 `@faasjs/types` 的共享预设
- 本地 TypeScript 覆写仅保留项目特定的设置
- 在配置了 `fmt` 或 `lint` 时使用 `vite-plus`
- `vite.config.ts` 从 `viteConfig` 开始，或复用 `@faasjs/dev` 中的共享 `fmt`/`lint` 规则
- 配置未无故重复 FaasJS 基线设置
- 当项目混合 UI 和 Node 测试时，UI 测试放在单独的项目中，使用 `environment: 'jsdom'`
- 当项目有类型测试时，放在单独的 `types` 项目中，而非混入运行时测试
- 本地配置使项目特定的行为可识别
- 导入遵循已有的别名和运行时解析器支持

## 延伸阅读

- [@faasjs/dev 包参考](/doc/dev/)
- [viteConfig](/doc/dev/variables/viteConfig.html)
- [viteFaasJsServer](/doc/dev/functions/viteFaasJsServer.html)
- [@faasjs/types 包参考](/doc/types/)
