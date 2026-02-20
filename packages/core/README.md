# @faasjs/core

FaasJS core package.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/core.svg)](https://github.com/faasjs/faasjs/blob/main/packages/core/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/core.svg)](https://www.npmjs.com/package/@faasjs/core)

## Install

```sh
npm install @faasjs/core
```

## Functions

- [defineApi](functions/defineApi.md)

## Type Aliases

- [DefineApiData](type-aliases/DefineApiData.md)
- [DefineApiOptions](type-aliases/DefineApiOptions.md)

## HTTP plugin

HTTP helpers (`Http`, `useHttp`, `HttpError`, `Cookie`, `Session`) are now exported from `@faasjs/core`.

## Server runtime

Server helpers (`Server`, `closeAll`, `getAll`, `useMiddleware`, `useMiddlewares`, `staticHandler`) are exported from `@faasjs/core`.
