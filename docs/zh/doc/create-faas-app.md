# create-faas-app

快速创建 FaasJS 项目脚手架。

## 使用方式

```bash
# npm
npx create-faas-app --name faasjs

# bun
bunx create-faas-app --name faasjs
```

## 参数

- `--name <name>`：项目名称（目录名）。

## 生成内容

默认会生成：

- `src/faas.yaml`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `server.ts`
- `src/pages/home/index.tsx`
- `src/pages/home/api/hello.func.ts`
- `src/pages/home/api/__tests__/hello.test.ts`
