FROM node:lts-alpine

RUN sed -i "s@http://dl-cdn.alpinelinux.org/@https://repo.huaweicloud.com/@g" /etc/apk/repositories

RUN apk add rsync zip git

RUN npm config set registry https://repo.huaweicloud.com/repository/npm/
RUN yarn config set registry https://repo.huaweicloud.com/repository/npm/
