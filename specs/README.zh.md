# FaasJS 规格文档

此目录用于存放 FaasJS 的内部规范性文档（spec）。

## 范围

- 作为框架级约定的内部单一事实来源。
- 第一版仅在仓库内维护，暂不发布到 faasjs.com。
- 历史文档在本阶段保持不变。

## 语言与命名

- 英文为默认主文档：`*.md`。
- 中文镜像使用 `.zh.md` 后缀：`*.zh.md`。
- 每个英文 spec 必须有同名中文镜像。

## 规范关键词

文中“必须”“禁止”“应该”“不应”“可以”采用 RFC 2119 语义。

## 状态定义

- `草案（Draft）`：可调整。
- `已采纳（Accepted）`：已通过，作为当前契约。
- `已废弃（Deprecated）`：为兼容/历史保留。

## 规范索引

| 规范      | 状态   | 版本 | 英文                                       | 中文                                             |
| --------- | ------ | ---- | ------------------------------------------ | ------------------------------------------------ |
| HTTP 协议 | 已采纳 | v1.0 | [http-protocol.md](./http-protocol.md)     | [http-protocol.zh.md](./http-protocol.zh.md)     |
| 路由映射  | 已采纳 | v1.0 | [routing-mapping.md](./routing-mapping.md) | [routing-mapping.zh.md](./routing-mapping.zh.md) |

## 编写流程

1. 从 [\_template.md](./_template.md) 与 [\_template.zh.md](./_template.zh.md) 开始。
2. 先更新英文主文档，再同步中文镜像。
3. 保持双语文档的规则编号和示例一致。
4. 每次实质修改都更新 `状态`、`版本`、`最后更新`。
