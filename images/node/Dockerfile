FROM node:lts-alpine

RUN apk add --no-cache git bash openssh rsync zip python3 make g++ brotli curl

RUN npm install -g npm@latest tsx && npm cache clean --force
