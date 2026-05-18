# 文件约定

在创建或审查前端页面、React 组件、hooks、FaasJS 后端路由文件或后台任务文件时，请使用此指南。

> **另请参阅**：[命名约定指南](./naming-convention.md)了解标识符和文件命名规则（camelCase、PascalCase、kebab-case、缩写等）。本指南涵盖文件*放在哪里*；命名规范则说明文件*叫什么*。

## 适用场景

- 创建新的页面、组件或 hooks
- 重构前端目录结构
- 在 `pages/` 下添加新的页面或功能目录
- 创建或移动 `.api.ts` 后端文件
- 创建或移动 `.job.ts` 后台任务文件
- 审查命名和放置决策（参见[命名约定指南](./naming-convention.md)）

## 默认工作流

1. 将前端页面放在 `pages/` 下。
2. 当保持文件夹易于浏览时，使用 `index.tsx` 作为主页面入口。
3. 将一次性的页面本地逻辑保持内联，直到有理由提取为止。
4. 当组件或 hook 值得拥有自己的抽象时，为其创建独立文件。
5. 按页面或功能组织前端代码。
6. 将组件放在 `components/` 中，hooks 放在 `hooks/` 中，后端路由处理器放在 `api/` 中，后台任务放在 `jobs/` 中。
7. 根据路由映射规范放置后端路由文件，根据任务指南放置任务文件。

## 规则

### 1. 仅在值得划分边界时提取组件

- 不要仅仅为了满足文件夹结构而将 JSX 拆分为新组件。
- 当提取不会改善可读性或复用性时，将一次性页面本地 UI 保持内联。
- 当提取 React 组件时，它应该放在自己的文件中。
- 文件名应该与组件名完全一致。
- 在文件名中保留组件的大小写。
- 页面文件是例外：页面入口文件应该使用 `index.tsx` 或 `default.tsx`。

示例：

- `UserCard.tsx` -> `export function UserCard() {}`
- `OrderList.tsx` -> `export default function OrderList() {}`

### 2. 仅在值得划分边界时提取 hooks

- 不要为内联更清晰的一次性逻辑创建 `useXxx` 封装。
- 当逻辑被复用、能显著简化组件、或值得拥有自己的可测试边界时，提取 hook。
- 当提取 hook 时，它应该放在自己的文件中。
- 文件名应该与 hook 名完全一致。
- Hook 文件应该保持 `useXxx` 命名模式。

示例：

- `useUser.ts` -> `export function useUser() {}`
- `useOrderFilters.ts` -> `export function useOrderFilters() {}`

### 3. 按页面或功能组织前端文件

- 前端页面应该放在 `pages/` 下。
- 每个页面或功能应该使用自己在 `pages/` 下的目录。
- 当文件夹清晰映射到一个功能页面时，主页面入口文件应该使用 `index.tsx`。
- 页面入口文件应该 `export default` 页面组件。
- 前端路由应该在应用代码或所选的 UI 框架中明确定义。
- 名为 `api/` 的目录保留给后端处理器。
- 组件必须放在 `components/` 下。
- Hooks 必须放在 `hooks/` 下。
- 当后端处理器是功能本地时，应该放在 `api/` 下。
- 只有页面入口文件可以直接放在外部页面或功能目录中。
- 属于同一页面或功能的共享代码应该保留在该页面或功能范围内，而不是平铺在根目录。
- 如果页面或功能文件变得过大而难以舒适浏览，应按照真正的组件、hook 或 API 边界进行拆分，而不是创建占位的辅助文件。

推荐这样：

```text
src/pages/
  index.tsx
  docs/
    index.tsx
  feature-name/
    index.tsx
    components/
      FeatureNameHeader.tsx
      FeatureNameTable.tsx
    hooks/
      useFeatureNameData.ts
      useFeatureNameFilters.ts
    api/
      list.api.ts
```

避免这样：

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
export default function FeatureNamePage() {
  return <h1>Feature Name</h1>
}
```

页面布局示例：

```text
src/pages/index.tsx
src/pages/feature-name/index.tsx
src/pages/docs/index.tsx
```

`src/pages` 下的前端页面组织是项目约定，不是隐式的 FaasJS 路由。在应用或 UI 框架中明确定义浏览器路由。后端 API 路由是独立的，仍然遵循 `src/` 下完整路径的零映射规则。

### 4. 后端文件遵循路由映射

- 后端路由文件必须遵循[路由映射规范](../../../docs/specs/routing-mapping.md)。
- API 入口文件必须以 `.api.ts` 结尾。
- API 文件应该放在页面或功能的 `api/` 目录下。
- 路由路径和文件路径必须保持直接的零映射对齐。
- 仅按规范定义的语义使用 `index.api.ts` 和 `default.api.ts`。

推荐这样：

```text
src/pages/feature-name/api/list.api.ts
src/pages/feature-name/api/index.api.ts
src/pages/feature-name/api/default.api.ts
```

这直接映射到：

- `/pages/feature-name/api/list`
- `/pages/feature-name/api`
- `/pages/feature-name/api/*` 回退

### 5. 后台任务放在 `jobs/` 下

- 任务入口文件必须以 `.job.ts` 结尾。
- 任务文件应该放在 `src/jobs/` 下，除非项目有明确的工作者根目录。
- 任务文件必须默认导出 `defineJob(...)`。
- `index.job.ts` 作为任务路径的目录入口。
- 移动或重命名 `.job.ts` 文件会改变 `enqueueJob()` 路径，就像移动 `.api.ts` 文件会改变其路由一样。

推荐这样：

```text
src/jobs/users/cleanup.job.ts
src/jobs/emails/send.job.ts
src/jobs/reports/index.job.ts
```

这直接映射到：

- `jobs/users/cleanup`
- `jobs/emails/send`
- `jobs/reports`

### 6. 保持导入路径清晰

- 在选择导入路径前，先阅读 `tsconfig.json` 及其继承的配置。
- 当路径需要跨多个目录时，优先使用 TypeScript 配置中已定义的别名，而不是深层相对导入。
- 对同层相邻文件优先使用简短相对导入，如 `./UserCard` 或 `../hooks/useUser`。
- 除非项目已配置了新的别名风格，或者你正在同一变更中更新项目配置，否则不要引入新的别名风格。

### 7. 遵循共享代码目录的命名约定

- **`utils/`** 用于共享工具函数。不要使用 `shared/`、`helpers/`、`common/` 或 `lib/`。当 `utils/` 变得庞大时，按领域拆分，如 `utils/date/`、`utils/format/`。
- **`constants/`** 用于常量定义。不要使用单数形式 `constant/`。

推荐这样：

```text
src/utils/date.ts
src/utils/format.ts
src/constants/index.ts
```

### 8. 将所有测试相关文件放在 `__tests__/` 下

- 测试文件、fixtures、mocks、stubs 以及任何其他测试支持文件必须放在 `__tests__/` 内。
- 不要将 `fixtures/`、`mocks/` 或其他测试支持目录作为 `__tests__/` 的同级目录。

推荐这样：

```text
src/feature/__tests__/
  feature.test.ts
  fixtures/
    data.ts
```

避免这样：

```text
src/feature/
  __tests__/
    feature.test.ts
  fixtures/           # ← __tests__ 的同级目录
    data.ts
```

## 审查清单

- 没有在缺乏可读性或复用理由的情况下提取一次性 UI 或状态逻辑
- 提取的组件有自己独立的文件
- 提取的 hooks 有自己独立的文件
- 组件文件名与组件名一致
- Hook 文件名与 hook 名一致
- 主页面入口文件在保持文件夹易于浏览时使用 `index.tsx`
- 页面入口文件默认导出页面组件
- 前端页面放在 `pages/` 下
- 前端组件放在 `components/` 中
- 前端 hooks 放在 `hooks/` 中
- 前端后端处理器放在 `api/` 中
- 后台任务文件放在 `jobs/` 中并以 `.job.ts` 结尾
- 只有页面入口文件保留在外部页面或功能层级
- 后端 `.api.ts` 文件遵循路由映射
- 导入遵循 `tsconfig.json` 中已定义的别名（如可用）
- 相邻导入保持相对路径，而不是强制到处使用别名
- 共享工具代码使用 `utils/` 而不是 `shared/`、`helpers/`、`common/` 或 `lib/`
- 常量定义使用 `constants/` 而不是单数形式 `constant/`
- 所有测试相关文件（fixtures、mocks、stubs）放在 `__tests__/` 内，而不是作为同级目录

## 延伸阅读

- [路由映射规范](../../../docs/specs/routing-mapping.md)
- [命名约定指南](./naming-convention.md)
- [defineApi 指南](./define-api.md)
- [任务指南](./jobs.md)
