# PG 表类型指南

在使用 `@faasjs/pg` 的声明合并定义或更新表类型时，请参考本指南。

## 适用场景

- 为 `@faasjs/pg` 定义应用表结构
- 添加列或 JSONB 类型结构
- 检查查询推断是否自然地从表定义中得出
- 提取依赖于 `TableType`、`ColumnName` 或 `ColumnValue` 的辅助函数

## 默认工作流

1. 将增强放在应用拥有的类型文件中，例如 `src/db/tables/<table_name>.ts`，并确保 `tsconfig.json` 包含该文件，然后在期望推断生效之前进行检查。
2. 在 `.d.ts` 文件中，首先导入 `@faasjs/pg`，然后使用 `declare module '@faasjs/pg'` 扩展 `Tables`。
3. 将每个表建模为其运行时行结构，并将 JSON 和 JSONB 对象形状保留在该合并接口中。
4. 让 `client.query`、`TableType`、`ColumnName` 和 `ColumnValue` 从该来源推断，而不是使用 `as` 强制指定结果类型。
5. 仅在将 `client.raw(...)` 或其他原生边界返回的数据转换为应用特定结构时，使用狭窄的断言。
6. 当共享辅助函数或包变更影响推断时，添加或更新 `expectTypeOf(...)` 覆盖。

## 最小示例

```ts
// src/db/tables/users.ts
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

### 1. 将 `Tables` 视为真相来源

- `Tables` 驱动表名推断和列级类型推断。
- 当表结构发生变化时，在调整查询代码之前先更新合并接口。
- 将类型定义保持在拥有该表的应用边界附近。
- 将增强放在 TypeScript 已包含在应用中的 `.d.ts` 或 `.ts` 文件中。
- 当增强位于 `.d.ts` 中时，首先导入 `@faasjs/pg`，以便 TypeScript 增强真实模块，而不是声明一个独立的 ambient 模块。
- 在 `declare module '@faasjs/pg'` 中定义 JSON 和 JSONB 列结构，而不是在其他地方散布重复的别名。
- 如果推断未更新，在添加类型断言之前检查 `tsconfig.json` 的 `include`、`files` 和项目引用。

### 2. 保持行结构具体

- 使用实际的运行时名称和值结构来建模行字段。
- JSON 或 JSONB 列优先使用精确的对象类型，而不是 `any`。
- 仅当存储的 JSON 结构确实可选时才包含可选属性。

### 3. 优先使用推断而非断言

- 让类型化查询结果从 `Tables`、`select(...)`、`first()` 和共享辅助函数泛型中自然得出。
- 除非数据来自 `client.raw(...)` 或其他原生边界，否则不要使用 `as` 强制指定查询结果类型。
- 如果类型化查询代码似乎需要类型转换，请改为修复表定义、所选列或辅助函数签名。

### 4. 保持消费者扩展模式

- 应用代码应继续使用 `Tables` 上的模块增强。
- 不要用特定应用的注册表或仅运行时类型化来替换声明合并。
- 在为 `@faasjs/pg` 做贡献时，保持未类型化表的回退行为是经过设计和文档记录的。

### 5. 保持辅助函数类型一致

- `TableType<T>` 应表示已知表的行结构。
- `ColumnName<T>` 应与表类型的实际键保持一致。
- `ColumnValue<T, C>` 应解析为该列的值类型。

### 6. 当接口变化时更新类型覆盖

- 在更改声明合并、共享辅助函数或查询推断时，添加或更新 `expectTypeOf(...)` 断言。
- 如果新的查询构建器特性影响结果形状，请同时测试运行时输出和推断类型。
- 优先使用有针对性的类型断言，而不是对无关推断类型进行宽泛的快照。

## 审查清单

- `Tables` 包含新的或变更的表结构
- 增强文件位于 `tsconfig.json` 包含的源文件或类型根目录中
- JSON 和 JSONB 列使用在 `declare module '@faasjs/pg'` 中定义的具体对象类型
- 类型化查询结果在原生边界之外不依赖 `as`
- 声明合并仍然从消费者代码中正常工作
- 辅助函数类型与合并的表定义保持一致
- 公开或共享的类型变更包含 `expectTypeOf(...)` 覆盖

## 延伸阅读

- [PG 查询构建器与原生 SQL 指南](./pg-query-builder.md)
- [PG 测试指南](./pg-testing.md)
- [Tables](/doc/pg/variables/Tables.html)
- [TableType](/doc/pg/type-aliases/TableType.html)
- [ColumnName](/doc/pg/type-aliases/ColumnName.html)
- [ColumnValue](/doc/pg/type-aliases/ColumnValue.html)
