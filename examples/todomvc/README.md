# todomvc

基于 FaasJS + Vue 实现的 todomvc。

## 主要特点

- 通过 `@faasjs/vue-plugin` 使得在 Vue 组件中可以轻松调用云函数
- 基于 `webpack-dev-server` 的 `proxy` 功能使得本地可以无缝联调云函数
- 简单的数据库 CURD 实现示例

## 文件夹结构

- **funcs** 放置云函数的文件夹
- **web** 放置网页的文件夹

## 安装

    npm install

## 运行

    npm run dev
