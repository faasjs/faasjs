# VSCode Container Image for FaasJS projects

[![faasjs/vscode](https://img.shields.io/badge/Docker-faasjs%2Fvscode-blue)](https://hub.docker.com/repository/docker/faasjs/vscode)
[![Build Status](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml/badge.svg)](https://github.com/faasjs/faasjs/actions/workflows/build-vscode-image.yml)
[![Image size](https://img.shields.io/docker/image-size/faasjs/vscode/latest)](https://hub.docker.com/repository/docker/faasjs/vscode)

## Features

- Base on [alpine](https://www.alpinelinux.org/) with tiny image size. (Also support debian with `faasjs/vscode:debian`)
- Includes latest [node](https://nodejs.org/), [npm](https://www.npmjs.com/) and [bun](https://bun.sh/).
- Includes [ohmyzsh](https://ohmyz.sh/) with below plugins:
  - git
  - zsh-completions
  - zsh-autosuggestions
  - zsh-history-substring-search
  - [`npm`](https://github.com/zfben/zsh-npm)

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
  // Change faasjs/vscode to faasjs/vscode:debian if you want to use debian.
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
