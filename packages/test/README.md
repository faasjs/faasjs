# @faasjs/test

FaasJS's testing module.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/test.svg)](https://github.com/faasjs/faasjs/blob/main/packages/test/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/test.svg)](https://www.npmjs.com/package/@faasjs/test)

## Install

```sh
npm install @faasjs/test
```

## Usage

```ts
import { test } from '@faasjs/test'
import Func from '../demo.func.ts'

const func = test(Func)

expect(await func.handler()).toEqual('Hello, world')
```

## Functions

- [detectNodeRuntime](functions/detectNodeRuntime.md)
- [loadPackage](functions/loadPackage.md)
- [nameFunc](functions/nameFunc.md)
- [test](functions/test.md)
- [useFunc](functions/useFunc.md)
- [usePlugin](functions/usePlugin.md)

## Classes

- [Func](classes/Func.md)
- [FuncWarper](classes/FuncWarper.md)

## Type Aliases

- [Config](type-aliases/Config.md)
- [ExportedHandler](type-aliases/ExportedHandler.md)
- [FuncConfig](type-aliases/FuncConfig.md)
- [FuncEventType](type-aliases/FuncEventType.md)
- [FuncReturnType](type-aliases/FuncReturnType.md)
- [Handler](type-aliases/Handler.md)
- [InvokeData](type-aliases/InvokeData.md)
- [LifeCycleKey](type-aliases/LifeCycleKey.md)
- [MountData](type-aliases/MountData.md)
- [Next](type-aliases/Next.md)
- [Plugin](type-aliases/Plugin.md)
- [UseifyPlugin](type-aliases/UseifyPlugin.md)
