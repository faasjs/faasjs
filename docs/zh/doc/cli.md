# @faasjs/cli

命令行工具，用于创建函数文件和启动本地服务。

## 启动服务器

- `faas server`：启动本地服务。
- `faas dev`：基于 `tsx watch` 的开发模式。

### 命令

```
faas server [options]
```

### 参数

#### -p

端口号，默认为 `3000`

### 命令

```
faas dev [options]
```

### 参数

#### -p

端口号，默认为 `3000`

## 创建新函数

### 命令

```
faas new <type> <name> [plugins...]
```

目前 `type` 仅支持 `func`。

示例：

```bash
npm exec faas new func hello
npm exec faas new func folder/demo cf http knex
```

## 全局参数

- `-v, --verbose`：显示 DEBUG 级别日志。
- `-r, --root <path>`：指定 FaasRoot。
- `-e, --env <name>`：指定运行环境，默认 `development`。
