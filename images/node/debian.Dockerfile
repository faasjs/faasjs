FROM node:lts

RUN apt-get update -y \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends git rsync zip python3 make g++ brotli \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN npm install -g npm@latest
