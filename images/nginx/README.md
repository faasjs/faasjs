# Nginx 静态网页托管镜像

包含以下特性：

- 基于 `alpine`，镜像文件不到 10 MB
- Alpine 源改为 [华为云镜像](https://mirrors.huaweicloud.com/home)，方便境内使用
- 支持 brotli 压缩
- 支持日志展示

## 使用方法

在静态网站项目中新建 Dockerfile，内容示例如下：

```Dockerfile
FROM faasjs/node:lts-alpine AS builder

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY . .

RUN npm run build

FROM faasjs/nginx

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
