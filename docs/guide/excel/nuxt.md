# 与 Nuxt.js 集成

在 [https://github.com/faasjs/examples/tree/master/nuxt](https://github.com/faasjs/examples/tree/master/nuxt) 可以看到一个完整的 FaasJS + Nuxt 示例项目。

## 准备工作

在集成前，需要先确认你的 Nuxt 项目已启用 Typescript，启用方法见 [https://nuxtjs.org/guide/typescript](https://nuxtjs.org/guide/typescript)。

## 集成步骤

1. 添加依赖项 `@faasjs/nuxt`，如 `yarn add @faasjs/nuxt@beta`
2. 在 `nuxt.config.ts` 中的 `moudles` 添加配置：`['@faasjs/nuxt', { baseUrl: 'https://api.example.com/', root: __dirname + '/funcs' }]`
```
  baseUrl 填写的是 API 网关的网址，开发环境不需要填写
  root 填写云函数所在的文件夹位置，仅开发环境需要填写
```
3. 在 `package.json` 的 `scripts` 中添加 FaasJS 的指令，如 `"faas": "faas"`

## Vue 组件中调用云函数

在 Nuxt 项目中，可以通过 `this.$faas(action, params)` 来请求 FaasJS 中的云函数。

当在开发环境中时，实际会通过请求 `/_faas` 来触发本地的云函数代码。远程环境则根据设置的子域名直接请求 API 网关。

## 常见问题

### root 可以设置为非项目文件夹下的文件夹吗？

可以，但如果使用相对路径，须经过 `path` 解析，如：

```typescript
import { resolve } from 'path';

export default {
  moudles: [
    [
      '@faasjs/nuxt',
      {
        root: path.reslove('./../funcs')      }
    ]
  ]
}
```
