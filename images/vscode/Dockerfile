FROM mcr.microsoft.com/vscode/devcontainers/base:alpine

RUN apk add nodejs npm --no-cache

RUN npm install -g npm@latest
RUN npm install -g yarn@latest
RUN npm install -g eslint@latest

RUN sed -i "s@dl-cdn.alpinelinux.org/@mirrors.cloud.tencent.com/@g" /etc/apk/repositories
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN yarn config set registry https://mirrors.cloud.tencent.com/npm/

RUN sed -i "s/ZSH_THEME=\"codespaces\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc
RUN sed -i "s/plugins=(git)/plugins=(git yarn)/" /root/.zshrc
RUN sed -i -e "s/bin\/ash/bin\/zsh/" /etc/passwd

COPY npm.plugin.zsh /root/npm.plugin.zsh
RUN echo "source /root/npm.plugin.zsh" >> /root/.zshrc
