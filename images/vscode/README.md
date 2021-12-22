# FaasJS VSCode Container 基础镜像

[![faasjs/vscode](https://img.shields.io/badge/Docker-faasjs%2Fvscode-blue)](https://hub.docker.com/repository/docker/faasjs/vscode)
[![Build Status](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml/badge.svg)](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml)
[![Image size](https://img.shields.io/docker/image-size/faasjs/vscode/latest)](https://hub.docker.com/repository/docker/faasjs/vscode)

包含以下特性：

- 基于 `node:16-alpine`，镜像文件约 60 MB
- 内置最新稳定版 `npm`, `yarn`, `eslint` 和 `node` 版本
- 集成了 `ohmyzsh` 及其 `git`、`yarn` 和 [`npm 插件`](https://github.com/zfben/zsh-npm)

## 准备工作

- 安装最新稳定版 [VSCode](https://code.visualstudio.com/)
- 安装最新稳定版 [Docker](https://www.docker.com/)
- 安装 VSCode 插件 [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## 使用方法

1. 在项目中新建 `.devcontainer` 文件夹
2. 在 `.devcontainer` 文件夹中新建文件 `devcontainer.json`
3. 在 `devcontainer.json` 中写入内容：

```json
{
	"name": "dev",
	"image": "faasjs/vscode",
	"extensions": [
		"dbaeumer.vscode-eslint",
		"eamodio.gitlens",
    "faasjs.faasjs-snippets"
	],
	"settings": {
		"terminal.integrated.shell.linux": "/bin/zsh"
	}
}
```
4. 用 VSCode 打开项目
5. 点击左下角绿色按钮，选择 `Remote-Containers: Reopen in Container`

## 改回默认源

```bash
npm config set registry https://registry.npmjs.org
yarn config set registry https://registry.yarnpkg.com
```
