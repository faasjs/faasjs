# A Nginx Image for FaasJS projects

[![faasjs/nginx](https://img.shields.io/badge/Docker-faasjs%2Fnginx-blue)](https://hub.docker.com/repository/docker/faasjs/nginx)
[![Build Status](https://github.com/faasjs/faasjs/actions/workflows/build-nginx-image.yml/badge.svg)](https://github.com/faasjs/faasjs/actions/workflows/build-nginx-image.yml)
[![Image size](https://img.shields.io/docker/image-size/faasjs/nginx/latest)](https://hub.docker.com/repository/docker/faasjs/nginx)

## Features

- Base on `alpine` with tiny image size.
- Support brotli compression.
- Output log to stdout.

## Usage

```Dockerfile
FROM faasjs/node AS builder

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
