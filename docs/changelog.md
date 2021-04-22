# 更新日志

注：可点击版本名查看完整代码变更记录。

## Beta

[`v0.0.2-beta.168 (2021-04-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.165...v0.0.2-beta.168)

- [优化] `@faasjs/cli` 部署失败时，优化错误提示。

[`v0.0.2-beta.167 (2021-04-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.163...v0.0.2-beta.167)

- [优化] `@faasjs/cli` 部署多个云函数时，自动根据 CPU 数量进行多进程部署。
- [优化] `@faasjs/tencentcloud` 优化多进程部署时的日志显示。
- [优化] `@faasjs/http` 测试环境下禁用缓存。

[`v0.0.2-beta.163 (2021-04-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.162...v0.0.2-beta.163)

- [优化] `@faasjs/cloud_function` 和 `@faasjs/browser` action 自动转小写。

[`v0.0.2-beta.162 (2021-04-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.161...v0.0.2-beta.162)

- [优化] `@faasjs/cli` 支持部署失败时重试。

[`v0.0.2-beta.161 (2021-04-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.160...v0.0.2-beta.161)

- [优化] `@faasjs/request` 新增 parse 配置项。

[`v0.0.2-beta.160 (2021-04-08)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.158...v0.0.2-beta.160)

- [优化] `@faasjs/knex` 优化 knex 的 ts 定义。
- [优化] `@faasjs/graphql` 优化 graphql 依赖项。

[`v0.0.2-beta.158 (2021-04-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.155...v0.0.2-beta.158)

- [修复] `@faasjs/tencentcloud` 修复云函数插件某些情况下未加载的问题。

[`v0.0.2-beta.155 (2021-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.153...v0.0.2-beta.155)

- [新增] `@faasjs/eslint-config-react`。

[`v0.0.2-beta.153 (2021-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.151...v0.0.2-beta.153)

- [修复] `@faasjs/cli` 修复日志等级错误的问题。

[`v0.0.2-beta.151 (2021-01-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.144...v0.0.2-beta.151)

- [优化] `@faasjs/tencentcloud` 优化打包机制。

[`v0.0.2-beta.144 (2021-01-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.140...v0.0.2-beta.144)

- [优化] `@faasjs/tencentcloud` 更新网关发布接口。

[`v0.0.2-beta.140 (2021-01-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.135...v0.0.2-beta.140)

- [优化] `@faasjs/load` 升级 js-yaml 版本。
- [优化] `@faasjs/load` 更新内置库。
- [优化] `@faasjs/typeorm` 支持 `useTypeORM`。

[`v0.0.2-beta.135 (2020-12-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.131...v0.0.2-beta.135)

- [优化] `@faasjs/cloud_function` 优化日志输出。

[`v0.0.2-beta.131 (2020-12-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.126...v0.0.2-beta.131)

- [优化] `@faasjs/create-faas-app` 优化命令行。

[`v0.0.2-beta.126 (2020-12-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.125...v0.0.2-beta.126)

- [修复] `@faasjs/knex` 修复 raw 的 ts 定义。

[`v0.0.2-beta.125 (2020-12-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.124...v0.0.2-beta.125)

- [优化] `@faasjs/eslint-config-vue` 优化规则。
- [优化] `@faasjs/http` 优化 ts 定义。

[`v0.0.2-beta.124 (2020-12-04)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.122...v0.0.2-beta.124)

- [优化] `@faasjs/cloud_function` config 支持传入一个 function。

[`v0.0.2-beta.122 (2020-11-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.121...v0.0.2-beta.122)

- [优化] `@faasjs/eslint-config-vue` 优化规则。

[`v0.0.2-beta.121 (2020-11-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.119...v0.0.2-beta.121)

- [修复] `@faasjs/load` 修复重复引用文件的问题。
- [优化] `@faasjs/request` debug 模式下显示更详细的日志。

[`v0.0.2-beta.119 (2020-11-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.118...v0.0.2-beta.119)

- [新增] 新增 `@faasjs/kafka`。

[`v0.0.2-beta.118 (2020-11-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.117...v0.0.2-beta.118)

- [修复] `@faasjs/knex` 修复 knex 连接。

[`v0.0.2-beta.117 (2020-11-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.116...v0.0.2-beta.117)

- [修复] `@faasjs/test` 补充 headers 的 ts 定义。
- [优化] `@faasjs/logger` 优化插件的日志显示。

[`v0.0.2-beta.116 (2020-10-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.115...v0.0.2-beta.116)

- [修复] `@faasjs/cloud_function` 修复本地调试时没 context 时的报错。

[`v0.0.2-beta.115 (2020-10-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.114...v0.0.2-beta.115)

- [优化] `@faasjs/react` 新增返回 `promise` 对象。

[`v0.0.2-beta.114 (2020-10-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.112...v0.0.2-beta.114)

- [优化] `@faasjs/http` 压缩后添加 originBody 以便日志查看。
- [优化] `@faasjs/cloud_function` 移除 context 中的 function 等无法序列化的内容。

[`v0.0.2-beta.112 (2020-10-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.107...v0.0.2-beta.112)

- [优化] `@faasjs/http` 默认使用 brotli 压缩。
- [修复] `@faasjs/http` 修复没有 body 时也压缩的 bug。

[`v0.0.2-beta.107 (2020-10-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.106...v0.0.2-beta.107)

- [优化] `@faasjs/http` 支持 gzip 压缩。
- [删除] 禁用并删除 `@faasjs/cos-secrets`，请使用 CFS 替代。

[`v0.0.2-beta.106 (2020-09-30)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.105...v0.0.2-beta.106)

- [优化] 优化 ts 定义。

[`v0.0.2-beta.105 (2020-09-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.104...v0.0.2-beta.105)

- [优化] `@faasjs/request`优化日志。

[`v0.0.2-beta.104 (2020-09-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.101...v0.0.2-beta.104)

- [优化] `@faasjs/request` 新增 pfx 和 passphrase 配置项。

[`v0.0.2-beta.101 (2020-09-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.100...v0.0.2-beta.101)

- [修复] 修复日志 bug。

[`v0.0.2-beta.100 (2020-09-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.96...v0.0.2-beta.100)

- [修复] 修复函数式编程接口的 bug。

[`v0.0.2-beta.96 (2020-08-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.95...v0.0.2-beta.96)

- [优化] `@faasjs/tencentcloud` 更新云函数配置项。

[`v0.0.2-beta.95 (2020-08-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.94...v0.0.2-beta.95)

- [优化] `@faasjs/react` 新增 `onError` 配置项。

[`v0.0.2-beta.94 (2020-08-11)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.93...v0.0.2-beta.94)

- [优化] 更新 ts 定义。

[`v0.0.2-beta.93 (2020-08-07)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.88...v0.0.2-beta.93)

- [修复] `@faasjs/server` 多个请求时排队处理。

[`v0.0.2-beta.88 (2020-08-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.87...v0.0.2-beta.88)

- [优化] 优化 ts 定义及相关测试用例。

[`v0.0.2-beta.87 (2020-08-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.86...v0.0.2-beta.87)

- [优化] 优化日志输出格式。

[`v0.0.2-beta.86 (2020-08-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.85...v0.0.2-beta.86)

- [优化] `@faasjs/redis` 支持 `useRedis`。

[`v0.0.2-beta.85 (2020-07-31)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.84...v0.0.2-beta.85)

- [新增] `@faasjs/knex`。
- [优化] 优化 useFunc 及 usePlugin。

[`v0.0.2-beta.84 (2020-07-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.82...v0.0.2-beta.84)

- [优化] `@faasjs/tencentcloud` 更新云API v3。

[`v0.0.2-beta.82 (2020-07-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.80...v0.0.2-beta.82)

- [优化] `@faasjs/tencentcloud` 优化触发器更新机制。

[`v0.0.2-beta.80 (2020-07-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.79...v0.0.2-beta.80)

- [新增] 新增 `@faasjs/react`，提供 `faas` 和 `useFaas` 两种风格的接口。

[`v0.0.2-beta.79 (2020-07-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.78...v0.0.2-beta.79)

- [修复] `@faasjs/server` 修复没有响应内容时的报错。

[`v0.0.2-beta.78 (2020-07-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.77...v0.0.2-beta.78)

- [修复] `create-faas-app` 删除旧的 babel 配置，改成 ts-jest。
- [修复] 修复示例项目的 package.json。
- [优化] `@faasjs/func` 优化 ts 支持。
- [修复] `@faasjs/server` 修正没有响应内容时的出错。

[`v0.0.2-beta.77 (2020-06-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.76...v0.0.2-beta.77)

- [优化] `@faasjs/server` 优化无缓存情况下的热加载。

[`v0.0.2-beta.76 (2020-06-19)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.70...v0.0.2-beta.76)

- [优化] `@faasjs/server` 优化无缓存情况下的热加载。
- [优化] `@faasjs/tencentcloud` 将 Node.js 默认版本升级到 12.16。
- [优化] `@faasjs/func` 优化 ts 支持。

[`v0.0.2-beta.70 (2020-06-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.69...v0.0.2-beta.70)

- [优化] `@faasjs/server` 优化缓存。

[`v0.0.2-beta.69 (2020-06-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.67...v0.0.2-beta.69)

- [优化] `@faasjs/logger` 云函数环境下,删除日志中的换行符。

[`v0.0.2-beta.67 (2020-06-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.66...v0.0.2-beta.67)

- [优化] `@faasjs/func` 优化日志显示和 ts 类型。

[`v0.0.2-beta.66 (2020-05-28)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.65...v0.0.2-beta.66)

- [优化] `@faasjs/test` 支持直接测试云函数，而非云函数文件。

[`v0.0.2-beta.65 (2020-05-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.64...v0.0.2-beta.65)

- [优化] `@faasjs/eslint-config-recommended` 优化规则。

[`v0.0.2-beta.64 (2020-05-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.63...v0.0.2-beta.64)

- [优化] `@faasjs/test` 中 `mount` 方法支持传入一个初始化后执行的函数。

[`v0.0.2-beta.63 (2020-05-18)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.61...v0.0.2-beta.63)

- [优化] `@faasjs/test` 新增 `mount` 方法，`JSONHandler` 方法支持 cookie 和 session 入参。

[`v0.0.2-beta.61 (2020-05-17)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.59...v0.0.2-beta.61)

- [优化] `@faasjs/cos-secrets` 支持密钥文件。
- [优化] `@faasjs/tencentcloud` 禁用腾讯云内置的旧版 `request`。

[`v0.0.2-beta.59 (2020-05-06)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.57...v0.0.2-beta.59)

- [修复] `@faasjs/func` 强制设定 `context.callbackWaitsForEmptyEventLoop = false`。
- [优化] `@faasjs/tencentcloud` 禁用腾讯云内置的旧版 `tencentcloud-sdk-nodejs`。

[`v0.0.2-beta.57 (2020-04-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.55...v0.0.2-beta.57)

- [优化] `@faasjs/tencentcloud` 升级默认 Node.js 版本为 `10.15`。
- [修复] `@faasjs/tencentcloud` 修正腾讯云新错误代码导致无法发布的问题。

[`v0.0.2-beta.55 (2020-04-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.54...v0.0.2-beta.55)

- [优化] `@faasjs/eslint-config-vue` 移除 `plugin:security/recommended`。

[`v0.0.2-beta.54 (2020-04-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.53...v0.0.2-beta.54)

- [优化] `@faasjs/cli` 适配 Windows 环境。

[`v0.0.2-beta.53 (2020-04-12)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.52...v0.0.2-beta.53)

- [优化] `@faasjs/server` 添加 sourceIp。

[`v0.0.2-beta.52 (2020-04-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.51...v0.0.2-beta.52)

- [优化] `@faasjs/server` 优化日志展示。
- [优化] `@faasjs/tencentcloud` 优化依赖库打包机制。

[`v0.0.2-beta.51 (2020-04-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.47...v0.0.2-beta.51)

- [优化] `@faasjs/http` 添加 HTTP 方法定义。
- [优化] `@faasjs/load` 优化打包时排除内置库的逻辑。
- [新增] 新增 `@faasjs/sequelize`。
- [优化] `@faasjs/http`、`@faasjs/server` 新增 header `X-SCF-RequestId`。

[`v0.0.2-beta.47 (2020-04-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.46...v0.0.2-beta.47)

- [优化] `@faasjs/cloud_function` 在云函数环境中使用内网域名提升性能。

[`v0.0.2-beta.46 (2020-03-26)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.40...v0.0.2-beta.46)

- [优化] `faasjs` 移除依赖项：@faasjs/browser, @faasjs/sql, @faasjs/redis。
- [新增] `@faasjs/mongo` 用于适配 mongodb。
- [优化] 优化了云函数的日志输出。

[`v0.0.2-beta.40 (2020-03-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.34...v0.0.2-beta.40)

- [优化] `@faasjs/http` 配置项新增 `path` 和 `ignorePathPrefix` 设置。

[`v0.0.2-beta.34 (2020-03-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.32...v0.0.2-beta.34)

- [修复] `@faasjs/cli` 修复当 tsconfig 中未使用 paths 功能时出错的问题。
- [优化] `@faasjs/typeorm` 新增 `Connection, Repository, SelectQueryBuilder, getRepository` 的输出。

[`v0.0.2-beta.32 (2020-03-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.29...v0.0.2-beta.32)

- [优化] `@faasjs/cli` 支持 tsconfig 的 paths 功能。
- [修复] `@faasjs/typeorm` 修复单体应用模式下连接出错的问题

[`v0.0.2-beta.29 (2020-03-03)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.28...v0.0.2-beta.29)

- [修复] `@faasjs/cos-secrets` 修复嵌套全局变量名错误的问题。

[`v0.0.2-beta.28 (2020-03-02)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.26...v0.0.2-beta.28)

- [优化] `@faasjs/eslint-config-recommended` 补充空格相关的样式设定。
- [优化] `@faasjs/cos-secrets` 本地模式下会读取本地文件。
- [优化] `@faasjs/sql` 支持从环境变量读取配置信息。
- [优化] `@faasjs/typeorm` 支持从环境变量读取配置信息。
- [优化] `@faasjs/redis` 支持从环境变量读取配置信息。
- [优化] `@faasjs/server` 出错信息以 json 格式返回。

[`v0.0.2-beta.26 (2020-03-01)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.25...v0.0.2-beta.26)

- [新增] `@faasjs/cos-secrets`，一个基于 COS 的密钥解决方案。
- [优化] 将文档移入 `docs` 文件夹。
- [优化] 将示例移入 `examples` 文件夹。

[`v0.0.2-beta.25 (2020-02-27)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.24...v0.0.2-beta.25)

- [优化] `@faasjs/tencentcloud` 腾讯云故障，禁用别名功能。

[`v0.0.2-beta.24 (2020-02-25)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.22...v0.0.2-beta.24)

- [优化] `@faasjs/graphql-server` 允许 `schemas` 参数为函数，且支持异步函数。
- [优化] `@faasjs/graphql-server` 导出变量新增 `GraphQLSchemaModule`。

[`v0.0.2-beta.22 (2020-02-24)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.20...v0.0.2-beta.22)

- [修复] `@faasjs/typeorm` 修复配置项错误。
- [修复] `@faasjs/tencentcloud` 修复部署时打包依赖项的错误。

[`v0.0.2-beta.20 (2020-02-23)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.18...v0.0.2-beta.20)

- [新增] 新增 `@faasjs/typeorm`。
- [优化] `@faasjs/sql` 单元测试新增 mysql 和 postgresql 的测试。

[`v0.0.2-beta.18 (2020-02-22)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.16...v0.0.2-beta.18)

- [优化] `@faasjs/tencentcloud` 云函数新增层和死信队列接口，COS 增加文件夹名。
- [优化] `@faasjs/load` 关闭 rollup 的警告信息。

[`v0.0.2-beta.16 (2020-02-21)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.13...v0.0.2-beta.16)

- [优化] `@faasjs/graphql-server` 内置 `@faasjs/http`。
- [优化] `@faasjs/tencentcloud` 云函数环境变量新增 `FaasLog=debug`。

[`v0.0.2-beta.13 (2020-02-20)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.10...v0.0.2-beta.13)

- [优化] `@faasjs/tencentcloud` 新增单元测试。
- [优化] `@faasjs/request` 新增 `file` 和 `downloadStream` 参数。
- [优化] `@faasjs/graphql-server` 规范化配置项，并将 `invokeData` 作为 context。

[`v0.0.2-beta.10 (2020-02-16)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.9...v0.0.2-beta.10)

- [优化] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.2-beta.9 (2020-02-15)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.8...v0.0.2-beta.9)

- [优化] 恢复腾讯云的别名功能。
- [优化] 修复和优化 travis-ci。

[`v0.0.2-beta.8 (2020-02-14)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.7...v0.0.2-beta.8)

- [优化] `faasjs` 不再内置 `@faasjs/graphql-server`，需手动添加使用。

[`v0.0.2-beta.7 (2020-02-13)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.5...v0.0.2-beta.7)

- [修复] `@faasjs/load` 修复打包时遇到内置模块报错的问题。
- [优化] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.2-beta.5 (2020-02-10)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.4...v0.0.2-beta.5)

- [优化] `@faasjs/test` 将 `jest` 添加为依赖项。

[`v0.0.2-beta.4 (2020-02-09)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.2...v0.0.2-beta.4)

- [优化] `@faasjs/func` handler 参数改为可选项。
- [新增] `@faasjs/graphql-server` 试验性支持 graphQL。

[`v0.0.2-beta.2 (2020-02-08)`](https://github.com/faasjs/faasjs/compare/v0.0.2-beta.1...v0.0.2-beta.2)

- [优化] `@faasjs/tencentcloud` 优化了部署云函数时的日志输出。

[`v0.0.2-beta.1 (2020-02-07)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.31...v0.0.2-beta.1)

- [优化] `@faasjs/tencentcloud` 补全已正式发布的云函数配置项。

[`v0.0.1-beta.31 (2020-02-06)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.29...v0.0.1-beta.31)

- [优化] `faasjs` 将 Sql 适配包从 `faasjs` 中移除。
- [优化] `@faasjs/eslint-config-recommended` 更新 eslint rules。

[`v0.0.1-beta.29 (2020-02-04)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.27...v0.0.1-beta.29)

- [修复] `@faasjs/tencentcloud` 修复由于禁用别名功能造成的 BUG。

[`v0.0.1-beta.27 (2020-02-03)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.25...v0.0.1-beta.27)

- [优化] `@faasjs/tencentcloud` 由于腾讯云故障，暂时禁用别名功能。

[`v0.0.1-beta.25 (2020-02-02)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.23...v0.0.1-beta.25)

- [修复] `@faasjs/tencentcloud` 修复腾讯云部署 BUG。
- [优化] `@faasjs/tencentcloud` 腾讯云云函数内存默认从 128 降低为 64。
- [优化] `@faasjs/tencentcloud` 默认环境变量新增 NODE_ENV，值为部署环境的名字。

[`v0.0.1-beta.23 (2020-02-01)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.21...v0.0.1-beta.23)

- [修复] 修复错误的版本号。
- [优化] `@faasjs/load` 移除 loadNpmVersion。

[`v0.0.1-beta.21 (2020-01-27)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.20...v0.0.1-beta.21)

- [修复] `@faasjs/tencentcloud` API 网关 BUG。
- [优化] `@faasjs/func` 云函数支持 callback。

[`v0.0.1-beta.20 (2020-01-26)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.18...v0.0.1-beta.20)

- [修复] `@faasjs/tencentcloud` API 网关 BUG。
- [优化] `@faasjs/tencentcloud` 提升打包速度。

[`v0.0.1-beta.18 (2020-01-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.16...v0.0.1-beta.18)

- [修复] `@faasjs/tencentcloud` 修复云函数命名错误。
- [优化] `@faasjs/server` 本地请求入参 method 改名为 httpMethod，增加 path 参数。

[`v0.0.1-beta.16 (2020-01-13)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.14...v0.0.1-beta.16)

- [修复] `@faasjs/load` 修复 rollup 配置。
- [修复] 修复 FaasJS 项目自动化测试配置。

[`v0.0.1-beta.14 (2020-01-04)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.12...v0.0.1-beta.14)

- [优化] `@faasjs/http` 移除无用的依赖项。
- [优化] `@faasjs/tencentcloud` 优化打包配置。

[`v0.0.1-beta.12 (2020-01-02)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.11...v0.0.1-beta.12)

- [修复] 在 `faasjs` 中补上依赖项 `@faasjs/http`。

[`v0.0.1-beta.11 (2020-01-01)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.10...v0.0.1-beta.11)

- [优化] 优化 FaasJS 项目打包配置。

[`v0.0.1-beta.10 (2019-12-30)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.8...v0.0.1-beta.10)

- [优化] 优化 FaasJS 项目的代码规范测试和自动化测试。
- [修复] `@faasjs/tencentcloud` 修复云函数部署时未完成部署就删除了 COS 代码包的问题。

[`v0.0.1-beta.8 (2019-12-26)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.7...v0.0.1-beta.8)

- [优化] 更新 VS Code 配置项以适应新版 ESlint。
- [优化] `@faasjs/tencentcloud` 更新云函数时会等待其更新生效后才进行后续步骤。
- [优化] `@faasjs/tencentcloud` 使用本地 node_modules 文件加速部署。

[`v0.0.1-beta.7 (2019-11-05)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.6...v0.0.1-beta.7)

- [优化] `@faasjs/logger` 性能优化，并移除测试用的 lastOuput 属性。
- [优化] `@faasjs/server` 移除 response 的日志输出以优化性能。
- [优化] `@faasjs/http` 直接使用 request_id 作为响应头 X-Request-Id 的值。
- [修复] `@faasjs/http` 使用 = 作为路径前缀避免模糊匹配。
- [删除] 移除周刊。

[`v0.0.1-beta.6 (2019-10-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.5...v0.0.1-beta.6)

- [修复] `@faasjs/logger` timeEnd 出错时的错误信息从 error 降级为 warn。

[`v0.0.1-beta.5 (2019-10-25)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.4...v0.0.1-beta.5)

- [优化] 新增性能测试用例。
- [修复] `@faasjs/logger` timeEnd 的 key 重复或未知时，报错信息从 error 降级为 warn。

[`v0.0.1-beta.4 (2019-10-22)`](https://github.com/faasjs/faasjs/compare/v0.0.1-beta.2...v0.0.1-beta.4)

- [新增] `@faasjs/http` cookie 新增 `sameSite` 选项。
- [优化] FaasJS 项目新增代码测试覆盖率。

`2019-10-21`

- [优化] 使用 lerna 管理 FaasJS 核心库。
- [优化] `@faasjs/request` 新增 timeout 和 auth 选项。
- [修复] 修正 `@faasjs/http` 遇到返回值为 null 时的错误。

`2019-10-16`

- [新增] 示例项目新增 [knex](https://github.com/faasjs/examples/tree/master/knex)。

`2019-10-15`

- [优化] 将 FaasJS 所有库都并入了 [faasjs/faasjs](https://github.com/faasjs/faasjs/tree/master/packages) 项目中，便于统一管理和更新。

`2019-10-13`

- [新增] [FaasJS 周刊](https://faasjs.com/weekly/) 开始试运行。

`2019-10-11`

- [优化] 教程中添加新加入的命令行指令。
- [新增] 官网新增 [支持 FaasJS](https://faasjs.com/contribute.html)。
- [修复] `@faasjs/func` 当 handler 没有返回时出现的一个判断异常。

`2019-10-09`

- [新增] 命令行工具新增 `yarn new func` 指令，用于快速创建云函数文件及其测试脚本，具体用法可见 `yarn new -h`。
- [优化] `create-faas-app` 创建的项目中加入 `.vscode/settings.json` 文件，用于优化 VS Code 下的编程体验。

`2019-10-08`

- [新增] 命令行工具 `create-faas-app` 用于快速创建 FaasJS 项目，可直接通过 `npx create-faas-app` 使用。

`2019-09-30`

- [发布] 结束 `Alpha` 阶段，开始 `Beta` 公测阶段。

## Alpha

`2019-04-13`

- [发布] FaasJS `Alpha` 阶段开发开始。
