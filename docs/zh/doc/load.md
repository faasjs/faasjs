# @faasjs/load

加载模块，用于读取配置和动态加载云函数。

## 安装

```bash
npm install @faasjs/load
```

## 常用能力

- `loadConfig`：按目录层级加载 `faas.yaml` 配置
- `loadPackage`：加载模块并按候选导出名取值
- `loadFunc`：直接加载 `.func` 文件
- `detectNodeRuntime`：检测当前 Node 运行时模式
