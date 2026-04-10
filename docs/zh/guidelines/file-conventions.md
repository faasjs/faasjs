# 文件约定

当你创建或评审前端页面、React 组件、hooks，或 FaasJS 后端路由文件时，请使用这份指南。

## 适用场景

- 创建新页面、组件或 hook
- 重组前端目录结构
- 在 `pages/` 下新增自动发现的页面路由
- 创建或移动 `.func.ts` 后端文件
- 评审文件名与文件位置是否对人类和 AI agent 都保持可预测

## 默认工作流

1. 前端页面放到 `pages/` 下。
2. 精确页面入口使用 `index.tsx`，`default.tsx` 只用于 fallback 页面。
3. 在有明确拆分理由前，把一次性的页面局部逻辑保留在当前文件内。
4. 当组件或 hook 真正形成边界时，再给它单独文件。
5. 以前端页面或 feature 为单位组织代码。
6. 组件放在 `components/`，hooks 放在 `hooks/`，后端处理器放在 `api/`。
7. 后端路由文件遵循 routing-mapping 规范。

## 规则

### 1. 只有组件真正形成边界时才抽文件

- 不要只是为了满足目录结构，就把 JSX 拆成新组件。
- 如果抽离既不能提升可读性，也没有复用价值，就把一次性的页面局部 UI 保留在页面内。
- React 组件一旦被抽出，就应该放在自己的文件中。
- 文件名应与组件名完全一致。
- 文件名大小写应保留组件自身的命名大小写。
- 页面文件是例外：页面入口文件应使用 `index.tsx` 或 `default.tsx`。

示例：

- `UserCard.tsx` -> `export function UserCard() {}`
- `OrderList.tsx` -> `export default function OrderList() {}`

### 2. 只有 hook 真正形成边界时才抽文件

- 如果一次性逻辑写在组件内更清晰，就不要为了形式去包一层 `useXxx`。
- 当逻辑可复用、能明显简化组件，或值得单独测试时，再抽成 hook。
- hook 一旦抽出，就应该放在自己的文件中。
- 文件名应与 hook 名完全一致。
- hook 文件应保留 `useXxx` 的命名模式。

示例：

- `useUser.ts` -> `export function useUser() {}`
- `useOrderFilters.ts` -> `export function useOrderFilters() {}`

### 3. 按页面或 feature 组织前端文件

- 前端页面应放在 `pages/` 下。
- 每个页面或 feature 应在 `pages/` 下使用自己的目录。
- 精确页面入口文件必须命名为 `index.tsx`。
- fallback 页面入口文件必须命名为 `default.tsx`。
- 页面入口文件应 `export default` 页面组件。
- 当 SSR 需要服务端数据时，页面入口文件可以导出 `loader`。
- 自动发现的页面不需要单独的路由配置文件。
- 默认的 React SSR 场景可以直接复用 `@faasjs/react/auto-pages/client-entry`、`server-entry` 和 `serve.js`，不必再保留本地 bootstrap 入口文件。
- 名为 `api/` 的目录保留给后端处理器使用，不得生成网页路由。
- 组件必须放在 `components/`。
- hooks 必须放在 `hooks/`。
- 该页面或 feature 的后端处理器应放在 `api/`。
- 只有页面入口文件可以直接放在最外层页面或 feature 目录。
- 同一个页面或 feature 的共享代码，应保持在该 feature 作用域内，而不是扁平化到根目录。
- 如果页面或 feature 文件大到难以快速浏览，应沿着真实的组件、hook 或 API 边界拆分，而不是创建占位 helper 文件。

优先这样组织：

```text
src/pages/
  index.tsx
  docs/
    default.tsx
  feature-name/
    index.tsx
    components/
      FeatureNameHeader.tsx
      FeatureNameTable.tsx
    hooks/
      useFeatureNameData.ts
      useFeatureNameFilters.ts
    api/
      list.func.ts
```

避免这样组织：

```text
src/pages/
  feature-name/
    FeatureNamePage.tsx
    FeatureNameHeader.tsx
    FeatureNameTable.tsx
    useFeatureNameData.ts
    useFeatureNameFilters.ts
```

页面入口示例：

```tsx
import type { PageLoaderContext } from '@faasjs/react/auto-pages'

export async function loader(_context: PageLoaderContext) {
  return {
    props: {
      title: 'Feature Name',
    },
  }
}

export default function FeatureNamePage(props: { title: string }) {
  return <h1>{props.title}</h1>
}
```

页面路由发现示例：

```text
src/pages/index.tsx         -> /
src/pages/feature-name/index.tsx
                         -> /feature-name
src/pages/docs/default.tsx -> /docs 与未匹配 /docs/* 的 fallback
```

前端页面路由按照 routing-mapping 规范从 `src/pages` 自动发现。使用 React SSR auto-pages 时，优先使用内置的 `@faasjs/react/auto-pages`，不要在应用里重复实现页面发现或路由胶水代码。后端 API 路由是独立的，仍然遵循 `src/` 全路径上的 Zero-Mapping 规则。

### 4. 后端文件遵循 routing-mapping

- 后端路由文件必须遵循 routing-mapping 规范。
- API 入口文件必须以 `.func.ts` 结尾。
- API 文件应放在该页面或 feature 的 `api/` 目录下。
- 路由路径与文件路径必须保持直接的 Zero-Mapping 对齐。
- 只有在规范定义的语义下，才使用 `index.func.ts` 和 `default.func.ts`。

优先这样组织：

```text
src/pages/feature-name/api/list.func.ts
src/pages/feature-name/api/index.func.ts
src/pages/feature-name/api/default.func.ts
```

它会直接映射为：

- `/pages/feature-name/api/list`
- `/pages/feature-name/api`
- `/pages/feature-name/api/*` fallback

### 5. 保持导入路径可读

- 选择导入路径前，先阅读 `tsconfig.json` 及其继承配置。
- 当路径需要跨越多层目录时，优先使用 TypeScript 配置中已经存在的 alias，而不是深层相对路径。
- 对相邻兄弟模块，优先使用短相对导入，例如 `./UserCard` 或 `../hooks/useUser`。
- 不要引入一种新的 alias 风格，除非项目已经配置好它，或者你会在同一改动里把项目配置一起补齐。

## 评审清单

- 一次性的 UI 或状态逻辑没有在缺乏可读性 / 复用理由时被提前抽离
- 抽离后的组件拥有自己的文件
- 抽离后的 hooks 拥有自己的文件
- 组件文件名与组件名一致
- hook 文件名与 hook 名一致
- 精确页面入口文件命名为 `index.tsx`
- fallback 页面入口文件命名为 `default.tsx`
- 页面入口文件默认导出页面组件
- page `loader` 只用于 SSR 数据需求
- 前端页面位于 `pages/`
- 前端组件位于 `components/`
- 前端 hooks 位于 `hooks/`
- 前端对应的后端处理器位于 `api/`
- 只有页面入口文件位于外层页面或 feature 目录
- 后端 `.func.ts` 文件遵循 routing-mapping
- 导入路径在适用时遵循 `tsconfig.json` 已定义的 alias
- 相邻模块保持相对导入，不强行把所有导入都改成 alias

## 延伸阅读

- [路由映射规范](../specs/routing-mapping.md)
- [defineApi 指南](./define-api.md)
