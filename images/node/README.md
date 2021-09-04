# FaasJS 基础镜像

包含以下特性：

- 基于 `node:lts-alpine`，镜像文件不到 50 MB
- Alpine、NPM 和 YARN 源都改为 [华为云镜像](https://mirrors.huaweicloud.com/home)，方便境内使用

## 使用方法

```bash
docker pull faasjs/node:lts-alpine
```

## 改回默认源

```bash
npm config set registry https://registry.npmjs.org
yarn config set registry https://registry.yarnpkg.com
```
