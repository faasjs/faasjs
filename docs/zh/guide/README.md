# 1 分钟上手

通过本教程，你将学到：

- 如何搭建本地开发环境？
- FaasJS 项目的基本结构是什么？

## 准备工作

FaasJS 基于 Node.js 构建，因此需要本地环境支持至少 Node.js 12.x。

若使用的是 OS X，可以使用 brew 来安装：`brew install node`。

由于 FaasJS 基于 TypeScript，因此建议使用 [Visual Studio Code](https://code.visualstudio.com/) 作为编辑器。

## 创建项目

你可以直接使用 npx 一键创建新项目，初次创建可以先跳过 Provider 配置：

    npx create-faas-app --example --noprovider

## 启动项目

执行 `npm exec faas server`，用浏览器打开 `http://localhost:3000/hello` 即可看到 hello.func.ts 的执行结果。

## 文件结构

### package.json

这是 Node.js 的项目配置，主要包含了依赖项和 Jest 配置。

### tsconfig.json

这个文件的内容仅仅为 `{}`，因为 FaasJS 本身对 Typescript 没有特殊的配置需求，你可以根据实际情况进行定制化配置。

### faas.yaml

这是 FaasJS 的配置文件，记录了云服务商的配置项和插件的配置项。

### *.func.ts

这是云函数文件，在 FaasJS 中，所有云函数文件都必须以 `.func.ts` 结尾。

### *.test.ts

这是单元测试文件，在 FaasJS 中，所有单元测试文件都必须以 `.test.ts` 结尾。

## 完整示例

在 [https://github.com/faasjs/faasjs/tree/main/examples/simple](https://github.com/faasjs/faasjs/tree/main/examples/simple) 可以看到一个包含了代码检查、自动化测试的简单例子。
