# FaasJS Templates

> Starter templates for FaasJS.

All templates are independent projects.

- Every template has its own `package.json`.
- Every template provides an independent test command: `npm run test`.
- These templates are **not** wired into repository CI by default.

## Learning Path

| Order | Template                                    | You will learn                                       |
| ----- | ------------------------------------------- | ---------------------------------------------------- |
| 1     | [`hello-api`](./hello-api/)                 | Smallest `defineApi` + unit test                     |
| 2     | [`routing-fallback`](./routing-fallback/)   | `index.api.ts` and `default.api.ts` routing fallback |
| 3     | [`params-and-errors`](./params-and-errors/) | Zod validation and API error handling                |

## Quick Start

```bash
cd templates/hello-api
npm install
npm run test
npm run dev
```

## Run In Codespaces

This repo includes `.devcontainer/devcontainer.json`.

After Codespace is created, `.devcontainer/post-create.sh` will auto-install dependencies for the workspace and all templates.

Then run any template directly:

```bash
cd templates/hello-api
npm run test
npm run dev
```

## Conventions

- API files end with `.api.ts`.
- API modules prefer `export default defineApi(...)`.
- `faas.yaml` is under `src/faas.yaml`.
- Request style follows FaasJS defaults: POST + JSON.
