# 环境变量

## FaasEnv

运行环境，根据 `faas.yaml` 中的配置生成。

如 `development`、`testing` 等。

可以通过 `process.env.FaasEnv` 读取。

## FaasLog

日志等级，线上默认为 `debug`，本地默认为 `info`。

可以通过 `process.env.FaasLog` 读取。
