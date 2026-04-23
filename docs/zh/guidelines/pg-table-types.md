# PG 表类型指南

当你实现或评审 `@faasjs/pg` 的表类型时，默认使用基于 `Tables` 的 declaration merging。

## 适用场景

- 为 `@faasjs/pg` 定义应用表结构
- 增加 columns 或 JSONB shapes
- 评审查询推导是否应该从表定义自然流出
- 抽取依赖 `TableType`、`ColumnName` 或 `ColumnValue` 的 helpers

## 默认工作流

1. 在应用自己拥有的类型文件里放置 augmentation，例如 `src/types/faasjs-pg.d.ts`，并先确认 `tsconfig.json` 已经包含这个文件，再期待推导结果发生变化。
2. 如果这是一个 `.d.ts` 文件，先导入 `@faasjs/pg`，再通过 `declare module '@faasjs/pg'` 扩展 `Tables`。
3. 让每张表的定义都贴近它的真实运行时 row shape，并把 JSON 与 JSONB 的对象结构也统一放进这个 merged interface。
4. 让 `client.query`、`TableType`、`ColumnName` 与 `ColumnValue` 都从这里推导，而不是用 `as` 强行指定结果类型。
5. 只有在把 `client.raw(...)` 或其它 raw 边界返回的数据转换成应用类型时，才使用收敛范围明确的类型断言。
6. 当共享 helper 或包级变更影响推导时，补上或更新 `expectTypeOf(...)` 覆盖。

## 最小示例

```ts
// src/types/faasjs-pg.d.ts
import '@faasjs/pg'

declare module '@faasjs/pg' {
  interface Tables {
    users: {
      id: number
      name: string
      metadata: {
        age: number
        timezone?: string
      }
    }
  }
}
```

## 规则

### 1. 把 `Tables` 当作唯一类型来源

- `Tables` 驱动表名推导以及列级别类型推导。
- 当表结构变化时，先更新 merged interface，再调整查询代码。
- 让类型定义尽量靠近真正拥有这张表的应用边界。
- augmentation 应放在 TypeScript 已经包含进应用的 `.d.ts` 或 `.ts` 文件里。
- 如果 augmentation 写在 `.d.ts` 中，先导入 `@faasjs/pg`，确保 TypeScript 是在增强真实模块，而不是声明一个独立的 ambient module。
- JSON 与 JSONB 列的类型统一定义在 `declare module '@faasjs/pg'` 里，不要在别处散落重复的类型别名。
- 如果推导结果没有变化，先检查 `tsconfig.json` 的 `include`、`files` 或 project references，再考虑加类型断言。

### 2. 让行结构保持具体

- 行字段应使用真实运行时字段名与值结构。
- JSON 或 JSONB 列优先使用精确对象类型，而不是 `any`。
- 只有当存储结构真的可选时，才把属性标成 optional。

### 3. 优先依赖推导而不是类型断言

- 让 typed query 的结果类型从 `Tables`、`select(...)`、`first()` 以及共享 helper 的泛型自然流出。
- 除非数据来自 `client.raw(...)` 或其它 raw 边界，否则不要用 `as` 去强制指定查询结果类型。
- 如果 typed query 代码看起来必须依赖类型断言，应该先修正表定义、选择列或 helper 签名。

### 4. 保持面向消费者的扩展模式

- 应用代码应继续通过 module augmentation 扩展 `Tables`。
- 不要把 declaration merging 换成应用私有 registry 或只在运行时存在的 typing。
- 如果你在修改 `@faasjs/pg` 本身，要让未声明表时的 fallback 行为保持明确并且有文档说明。

### 5. 保持 helper types 对齐

- `TableType<T>` 应表示已知表的 row shape。
- `ColumnName<T>` 应始终和该表的真实 keys 对齐。
- `ColumnValue<T, C>` 应解析为该列的值类型。

### 6. surface 变更时更新类型覆盖

- 当 declaration merging、共享 helpers 或查询推导发生变化时，补上或更新 `expectTypeOf(...)` 断言。
- 如果新的 query-builder 特性会影响结果结构，就同时测试运行时输出和推导出的类型。
- 优先写聚焦的类型断言，而不是给无关推导拍大而全的快照。

## 评审清单

- `Tables` 里是否包含新的或变更后的表结构
- augmentation 文件是否位于 `tsconfig.json` 已包含的 source/type root 中
- JSON 与 JSONB 列是否在 `declare module '@faasjs/pg'` 中定义了具体对象类型
- typed query 的结果是否没有在 raw 边界之外依赖 `as`
- declaration merging 是否仍然能从消费者代码里生效
- helper types 是否仍与 merged table definition 对齐
- 公开或共享类型变更是否包含 `expectTypeOf(...)` 覆盖

## 延伸阅读

- [PG 查询构建指南](./pg-query-builder.md)
- [PG 测试指南](./pg-testing.md)
- [Tables](/doc/pg/interfaces/Tables.html)
- [TableType](/doc/pg/type-aliases/TableType.html)
- [ColumnName](/doc/pg/type-aliases/ColumnName.html)
- [ColumnValue](/doc/pg/type-aliases/ColumnValue.html)
