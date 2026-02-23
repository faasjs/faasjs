# 1 分钟上手

通过本教程，你将学到：

- 如何搭建本地开发环境？
- FaasJS 项目的基本结构是什么？

## 准备工作

FaasJS 基于 Node.js 构建，推荐通过 [mise](https://mise.jdx.dev/) 管理本地环境，当前要求至少 Node.js 24.0.0。

先在项目根目录执行：

```bash
mise install
```

由于 FaasJS 基于 TypeScript，因此建议使用 [Visual Studio Code](https://code.visualstudio.com/) 作为编辑器。

## 创建项目

你可以直接使用 npx 一键创建新项目：

    mise exec -- npx create-faas-app --name faasjs

## 启动项目

执行 `mise exec -- npm run dev` 启动开发环境；若要启动生产服务，执行 `mise exec -- npm run build && mise exec -- npm run start`。

## 文件结构

### package.json

这是 Node.js 的项目配置，主要包含了依赖项和测试配置。

### tsconfig.json

这个文件默认包含 TypeScript 严格模式、React JSX 以及 `vitest/globals` 类型配置，可在此基础上按需扩展。

### src/faas.yaml

这是 FaasJS 的配置文件，记录了服务商、插件以及本地开发服务（`server`）等配置项。

### \*.func.ts

这是云函数文件，在 FaasJS 中，所有云函数文件都必须以 `.func.ts` 结尾。

### \*.test.ts

这是单元测试文件，在 FaasJS 中，所有单元测试文件都必须以 `.test.ts` 结尾。

## 完整示例

可以参考官方 examples：

- [faasjs/examples](https://github.com/faasjs/faasjs/tree/main/examples)
