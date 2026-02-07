# @faasjs/knex

FaasJS 的 SQL 插件，基于 Knex。

## 安装

```bash
npm install @faasjs/knex
```

## 核心能力

- `useKnex`：在函数里挂载 Knex 插件
- `query`：直接访问 query builder
- `raw`：执行原生 SQL
- `transaction`：事务封装

## 配置来源

插件配置支持两类来源：

- 云函数代码中的插件配置
- `faas.yaml` 中同名插件配置

最终会按优先级合并。
