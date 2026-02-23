# FaasJS Examples

> Bilingual onboarding examples for FaasJS (English + 简体中文).

All examples are independent projects.

- Every example has its own `package.json`.
- Every example provides an independent test script: `npm run test`.
- These examples are **not** wired into repository CI by default.

## Learning Path 学习路径

| Order | Example | You will learn | 你将学到 |
| --- | --- | --- | --- |
| 1 | [`01-hello-api`](./01-hello-api/) | Smallest `defineApi` + unit test | 最小可运行 API 与单测 |
| 2 | [`02-routing-fallback`](./02-routing-fallback/) | `index.func.ts` and `default.func.ts` routing fallback | 路由命中与逐级兜底 |
| 3 | [`03-params-and-errors`](./03-params-and-errors/) | Zod validation and API error handling | 参数校验与错误处理 |
| 4 | [`04-knex-crud`](./04-knex-crud/) | Knex migration, CRUD, and transaction | Migration、CRUD 与事务 |
| 5 | [`05-auth-session`](./05-auth-session/) | Signup/signin/signout with session | 注册登录与 Session |
| 6 | [`06-react-client`](./06-react-client/) | React client calling FaasJS API | React 调用 FaasJS API |

## Quick Start 快速开始

```bash
cd examples/01-hello-api
npm install
npm run test
npm run dev
```

## Run in Codespaces 在 Codespaces 中运行

This repo includes `.devcontainer/devcontainer.json`.

这个仓库内置了 `.devcontainer/devcontainer.json`，可直接用于 GitHub Codespaces。

After Codespace is created, `.devcontainer/post-create.sh` will auto-install dependencies for the workspace and all examples.

创建 Codespace 后，`.devcontainer/post-create.sh` 会自动安装仓库和全部示例依赖。

Then run any example directly:

```bash
cd examples/01-hello-api
npm run test
npm run dev
```

For Knex examples:

```bash
cd examples/04-knex-crud
npm run migrate:latest
npm run dev
```

## Conventions 约定

- API files end with `.func.ts`.
- `faas.yaml` is under `src/faas.yaml`.
- Request style follows FaasJS defaults: POST + JSON.
