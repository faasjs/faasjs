# VSCode Container Image for FaasJS projects

[![faasjs/vscode](https://img.shields.io/badge/Docker-faasjs%2Fvscode-blue)](https://hub.docker.com/repository/docker/faasjs/vscode)
[![Build Status](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml/badge.svg)](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml)
[![Image size](https://img.shields.io/docker/image-size/faasjs/vscode/latest)](https://hub.docker.com/repository/docker/faasjs/vscode)

## Features

- Includes latest [node](https://nodejs.org/) and package managers:
  - [npm](https://www.npmjs.com/)
  - [pnpm](https://pnpm.io/)
  - [bun](https://bun.sh/).
- Includes [ohmyzsh](https://ohmyz.sh/) with below plugins:
  - git
  - zsh-completions
  - zsh-autosuggestions
  - zsh-syntax-highlighting
  - zsh-history-substring-search
  - [zsh-npm](https://github.com/zfben/zsh-npm)
  - [zsh-pnpm](https://github.com/zfben/zsh-pnpm)
  - [zsh-bun](https://github.com/zfben/zsh-bun)

## Before you use

- Install latest [VSCode](https://code.visualstudio.com/).
- Install latest [Docker](https://www.docker.com/).
- Install VSCode plugin: [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

## Usage

1. Create a folder `.devcontainer` in your project root.
2. Create `devcontainer.json` in `.devcontainer` folder.
3. Copy below code into `devcontainer.json`:
```json
{
	"name": "dev",
	"image": "faasjs/vscode",
	"extensions": [
		"eamodio.gitlens",
    "faasjs.faasjs-snippets",
    "biomejs.biome"
	],
	"settings": {
		"terminal.integrated.shell.linux": "/bin/zsh"
	}
}
```
4. Open your project with VSCode.
5. Click popup window with `Remote-Containers: Reopen in Container`.
