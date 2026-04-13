# FaasJS Templates

> Bilingual starter templates for FaasJS (English + 简体中文).

All templates are independent projects.

- Every template has its own `package.json`.
- Every template provides an independent test command: `vp test`.
- These templates are **not** wired into repository CI by default.

## Learning Path 学习路径

| Order | Template                                    | You will learn                                            | 你将学到                            |
| ----- | ------------------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| 1     | [`hello-api`](./hello-api/)                 | Smallest `defineApi` + unit test                          | 最小可运行 API 与单测               |
| 2     | [`routing-fallback`](./routing-fallback/)   | `index.func.ts` and `default.func.ts` routing fallback    | 路由命中与逐级兜底                  |
| 3     | [`params-and-errors`](./params-and-errors/) | Zod validation and API error handling                     | 参数校验与错误处理                  |
| 4     | [`react-client`](./react-client/)           | Minimal React client routing with built-in page discovery | 内置页面发现的最小 React 客户端路由 |

## Quick Start 快速开始

```bash
cd templates/hello-api
vp install
vp test
vp run dev
```

## Run in Codespaces 在 Codespaces 中运行

This repo includes `.devcontainer/devcontainer.json`.

这个仓库内置了 `.devcontainer/devcontainer.json`，可直接用于 GitHub Codespaces。

After Codespace is created, `.devcontainer/post-create.sh` will auto-install dependencies for the workspace and all templates.

创建 Codespace 后，`.devcontainer/post-create.sh` 会自动安装仓库和全部模板依赖。

Then run any template directly:

```bash
cd templates/hello-api
vp test
vp run dev
```

## Conventions 约定

- API files end with `.func.ts`.
- `faas.yaml` is under `src/faas.yaml`.
- Request style follows FaasJS defaults: POST + JSON.
