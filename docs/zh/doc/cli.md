# @faasjs/cli

命令行工具，用于初始化项目、开发、构建、启动与质量检查。

## 命令总览

```bash
faas init [name]
faas dev [options]
faas build
faas start [options]
faas new page <name>
faas new api <name>
faas new feature <name>
faas check [options]
```

## init

初始化项目模板，支持在当前目录或指定目录创建。

```bash
npm exec faas init
npm exec faas init my-app
```

参数：

- `-f, --force`：目标目录非空时强制初始化。

## dev

固定行为：启动 Vite 开发服务器。

```bash
npm exec faas dev
npm exec faas dev -- --port 5173
```

参数：

- `-p, --port <port>`：Vite 端口，默认 `5173`。

## build

固定行为：执行 `vite build`。

```bash
npm exec faas build
```

## start

固定行为：启动生产服务（`public` 静态资源 + `dist/index.html` fallback + `src/**/*.func.ts` API）。

```bash
npm exec faas start
npm exec faas start -- --port 3000
```

参数：

- `-p, --port <port>`：服务端口，默认 `3000`。
- `--api-only`：仅启动 API 服务（用于 Vite 代理场景）。

## new page

生成页面文件：`src/pages/**/index.tsx`

```bash
npm exec faas new page dashboard
```

## new api

生成 API 文件：`src/pages/**/api/*.func.ts`，并默认生成测试文件与 `zod` 校验模板。

```bash
npm exec faas new api dashboard/list
npm exec faas new api dashboard/api/list
```

## new feature

生成功能模块目录，包含 `components`、`api` 和测试文件。

```bash
npm exec faas new feature dashboard/report
```

## check

默认串行执行质量门：`lint -> type -> test`。

```bash
npm exec faas check
npm exec faas check -- --no-test
```

参数：

- `--no-lint`：跳过 lint。
- `--no-type`：跳过类型检查。
- `--no-test`：跳过测试。

## 全局参数

- `-v, --verbose`：显示 DEBUG 级别日志。
- `-r, --root <path>`：指定项目根目录。
- `-e, --env <name>`：指定运行环境，默认 `development`。
