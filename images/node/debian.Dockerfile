FROM node:lts

RUN apt-get update -y
RUN apt-get install -y git rsync zip python3 make g++ brotli

RUN corepack enable
RUN npm install -g npm@latest
