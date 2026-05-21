# YAML 指南

当你在 FaasJS 项目中需要使用 `@faasjs/utils` 的 `parseYaml` 直接解析 YAML 文本时，请参考本指南。

## 适用场景

- 在自定义工具或脚本中解析 YAML 配置文本
- 从 YAML 片段构建配置对象
- 在 CLI 工具或开发脚本中验证 YAML 结构

## `@faasjs/utils` 提供的 YAML 能力

- `parseYaml` — 解析 FaasJS 支持的 YAML 子集

## 常见模式

### 1. 直接解析 YAML 文本

当脚本直接接收 YAML 文本，并且你需要与 FaasJS 配置解析相同的支持子集和错误消息时，使用 `parseYaml`。

```ts
import { parseYaml } from '@faasjs/utils'

const config = parseYaml(`defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: 'replace-me'
`)

console.log(config)
```

## 审查清单

- `parseYaml` 用于直接 YAML 文本解析
- 解析后的 YAML 结构需要自行验证（例如使用 `@faasjs/utils` 的 Zod schemas）

## 延伸阅读

- [@faasjs/utils 包参考](/doc/utils/)
- [parseYaml](/doc/utils/functions/parseYaml.html)
