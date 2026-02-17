# faas.yaml

为了灵活高效的处理简单应用和复杂应用的配置，FaasJS 采用了递归式的配置方式。

## 文件名

配置文件的名字统一为 **faas.yaml**。

## 读取顺序

当编译云函数文件时，会从云函数所在在文件夹开始，逐级向外寻找配置文件并合并配置，合并配置的优先级也以云函数所在文件夹的配置文件为最高优先级。

比如下面的文件结构：`| 表示文件夹，- 表示文件`

```
| root
  - faas.yaml
  | user
    - faas.yaml
    | account
      - faas.yaml
      - create.func.ts
```

当编译 `create.func.ts` 时，会依次读取：

1. `account/faas.yaml`
2. `user/faas.yaml`
3. `root/faas.yaml`

然后按以下顺序进行配置项的合并和覆盖（后面的覆盖前面的）：

1. `root/faas.yaml`
2. `user/faas.yaml`
3. `account/faas.yaml`

## 节点说明

### 一级节点：环境节点

* **defaults** 默认环境，必须存在，用于设置全局默认配置
* **local** 默认本地开发环境
* **testing** 默认线上测试环境
* **production** 默认线上正式环境

### 二级节点：服务商、插件 & 部署节点

* **providers** 服务商节点，用于配置服务商的 Token 等全局信息。
* **plugins** 插件节点，各个插件会读取此处的配置作为默认配置。
* **server** 服务节点，用于配置本地开发服务读取路径和请求基路径。
* **deploy** 部署节点

### server 节点

`server` 节点用于 `@faasjs/dev` 的本地开发服务器：

* **root** 项目根目录，默认 `.`。
* **base** API 基路径，默认 `/`。

约定如下：

1. `server.root` 始终表示项目根目录。
2. 云函数目录固定为 `<server.root>/src`。
3. `@faasjs/dev` 入口配置默认读取 `<root>/src/faas.yaml`（`root` 来自 Vite 的 `root` 或 `faas types --root`）。
4. typegen 输出固定为 `<server.root>/src/.faasjs/types.d.ts`。

> `types` 自定义配置已移除，不再支持在 `faas.yaml` 中配置。

### 三级节点：具体配置

#### 插件节点

节点名可自行设定，多个同类插件可以设定为多个插件配置。

若节点名为插件的名字，则视为该插件的默认节点。

* **type** 插件类型
* **provider** 服务商名字，即 providers 中设置的 key；对于非服务商云资源（如数据库），此项不填写
* **config** 具体配置项，不同类型有不同的可配置项

例：

```yaml
plugins:
  function:
    provider: first
    type: faas
    config:
      MemorySize: 128
  second_faas:
    provider: second
    type: faas
    config:
      MemorySize: 256
  mysql:
    type: mysql
    config:
      host: 127.0.0.1
```
