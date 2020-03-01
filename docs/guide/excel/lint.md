# 代码规范检查

FaasJS 使用 [ESLint](https://eslint.org/) 来提供代码格式规范检查能力。

同时为了支持全栈模式，也提供了包含 Vue.js 的全栈模式检查规范。

## 后端模式

### 包含规范

- [eslint:recommended](https://eslint.org/docs/rules/)
- [security/recommended](https://github.com/nodesecurity/eslint-plugin-security)
- [@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint)

### 配置方法

1. 通过 `yarn add -D @faasjs/eslint-config-recommended@beta` 安装依赖库
2. 在 **package.json** 中添加配置项：

```json
"eslintConfig": {
  "extends": [
    "@faasjs/recommended"
  ]
},
"eslintIgnore": [
  "tmp"
]
```

### 命令

```
yarn eslint --ext .ts .
```

## 全栈模式

### 包含规范

- [eslint:recommended](https://eslint.org/docs/rules/)
- [security:recommended](https://github.com/nodesecurity/eslint-plugin-security)
- [@typescript-eslint:recommended](https://github.com/typescript-eslint/typescript-eslint)
- [vue:essential](https://eslint.vuejs.org/rules/)

### 配置方法

1. 通过 `yarn add -D @faasjs/eslint-config-vue@beta` 安装依赖库
2. 在 **package.json** 中添加配置项：

```json
"eslintConfig": {
  "extends": [
    "@faasjs/vue"
  ]
},
"eslintIgnore": [
  "tmp"
]
```

### 命令

```
yarn eslint --ext .ts,.vue .
```
