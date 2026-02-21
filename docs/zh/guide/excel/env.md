# 环境变量

## FaasEnv

运行环境，根据 `faas.yaml` 中的配置生成。

如 `development`、`testing` 等。

可以通过 `process.env.FaasEnv` 读取。

## FaasLog

日志等级，线上默认为 `debug`，本地默认为 `info`。

可以通过 `process.env.FaasLog` 读取。

## 自动读取 `.env`

FaasJS 使用 Node.js 内置能力自动读取 `.env`（不依赖第三方库）：

- `@faasjs/core` 的 `new Server(...)` 在初始化时会尝试读取 `process.cwd()/.env`。
- `@faasjs/dev` 的 `faas` CLI（`types` / `knex` / `lint`）会自动读取：
  - 传入 `--root` 时：`<root>/.env`
  - 未传入 `--root` 时：`process.cwd()/.env`

说明：

- 目前仅自动读取 `.env`（不包含 `.env.local` 或 `.env.<mode>`）。
- 环境变量优先级为：**系统环境变量 > `.env`**（已存在的 `process.env` 不会被覆盖）。
- `.env` 读取失败时（例如文件内容不可被正常读取），会抛出错误并中止当前启动/命令流程。
