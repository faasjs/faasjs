# @faasjs/vite

FaasJS's vite plugin.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/vite.svg)](https://github.com/faasjs/faasjs/blob/main/packages/vite/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/vite.svg)](https://www.npmjs.com/package/@faasjs/vite)

## Install

```sh
npm install @faasjs/vite
```

## Usage

Add to vite.config.ts

```ts
import { viteFaasJsServer } from '@faasjs/vite'

export default defineConfig({
  plugins: [
    viteFaasJsServer() // add this line
  ],
})
```

The plugin starts an in-process FaasJS server during Vite development.

## Options

See [ViteFaasJsServerOptions](type-aliases/ViteFaasJsServerOptions.md) for more options.

## Functions

- [viteFaasJsServer](functions/viteFaasJsServer.md)

## Type Aliases

- [ViteFaasJsServerOptions](type-aliases/ViteFaasJsServerOptions.md)
