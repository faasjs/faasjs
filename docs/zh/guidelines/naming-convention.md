# 命名规范

在命名标识符——函数、变量、类型、文件和目录时，使用本指南。

文件放置规则（放在哪里）请参见[文件约定](./file-conventions.md)。本指南涵盖如何命名它们。

---

## 1. 标识符命名

| 类别           | 规范                          | 示例                                   |
| -------------- | ----------------------------- | -------------------------------------- |
| 函数           | `camelCase`，动词优先         | `createClient`，`parseSchemaValue`     |
| 类             | `PascalCase`                  | `QueryBuilder`，`FaasBrowserClient`    |
| 类型 / 接口    | `PascalCase`                  | `ServerOptions`，`DefineApiData`       |
| 枚举           | `PascalCase`（名称和成员）    | `JobStatus { Pending, Running }`       |
| 常量           | `PascalCase`                  | `ViteConfig`，`DefaultTimeout`         |
| React 组件     | `PascalCase`                  | `UserCard`，`ErrorBoundary`            |
| React 钩子     | `camelCase`，`use` 前缀       | `useUser`，`useDebounce`               |
| React 组件属性 | `PascalCase`，以 `Props` 结尾 | `FaasDataWrapperProps`                 |
| 类型守卫函数   | `camelCase`，`is` 前缀        | `isOperator`，`isTemplateStringsArray` |
| 泛型类型参数   | 单个大写或 PascalCase         | `T`，`TData`，`TResult`                |

### 1.1 缩写规则

| 规则                     | 正确                                | 错误                                |
| ------------------------ | ----------------------------------- | ----------------------------------- |
| 单词边界的缩写           | `parseApiFilenameFromStack`         | `parseAPIFilenameFromStack`         |
| 常见技术术语作为单词     | `Http`，`Json`，`Url`，`Html`，`Id` | `HTTP`，`JSON`，`URL`，`HTML`，`ID` |
| `lifecycle` 作为一个单词 | `lifecycleKey`，`LifecycleHook`     | `lifeCycleKey`，`LifeCycleHook`     |

### 1.2 常见动词前缀

| 前缀                 | 用法                                                          |
| -------------------- | ------------------------------------------------------------- |
| `define*`            | 定义 API 或 Job：`defineApi`，`defineJob`                     |
| `create*`            | 工厂方法：`createClient`，`createSplittingContext`            |
| `get*` / `set*`      | 访问器：`getClient`，`setMock`                                |
| `parse*` / `format*` | 解析 / 格式化：`parseSchemaValue`，`formatSchemaError`        |
| `use*`               | React 钩子：`useFaas`，`useStateRef`                          |
| `is*`                | 类型守卫 / 谓词：`isOperator`，`isTypegenInputFile`           |
| `*Options`           | 配置类型：`ServerOptions`，`EnqueueJobOptions`                |
| `*Props`             | React 属性类型：`FaasDataWrapperProps`                        |
| `*Data` / `*Inject`  | defineApi 数据 / 注入类型：`DefineApiData`，`DefineApiInject` |

---

## 2. 文件和目录命名

| 类别         | 规范                       | 示例                                          |
| ------------ | -------------------------- | --------------------------------------------- |
| 源目录       | `camelCase`                | `loadPackage/`，`parseYaml/`                  |
| 源文件       | `kebab-case`               | `query-builder.ts`，`http-error.ts`           |
| 测试文件     | `kebab-case` + `.test.ts`  | `query-builder.test.ts`                       |
| 组件文件     | PascalCase，与组件名称匹配 | `UserCard.tsx` → `export function UserCard()` |
| 钩子文件     | camelCase，与钩子名称匹配  | `useUser.ts` → `export function useUser()`    |
| 类型定义文件 | `kebab-case`               | `types.ts`，`server-types.ts`                 |

---

## 3. 审查清单

- [ ] 函数以动词开头（camelCase）
- [ ] 类型 / 接口 / 常量为 PascalCase
- [ ] 目录使用 camelCase
- [ ] 文件使用 kebab-case（组件/钩子文件使用自己的名称）
- [ ] 缩写遵循单词规则：`Http`、`Json`、`Url`、`Id`
- [ ] `lifecycle` 是一个单词，全部小写

---

## 延伸阅读

- [文件约定](./file-conventions.md) — 文件放置规则
- [代码注释指南](./code-comments.md) — 何时重命名 vs 添加注释
