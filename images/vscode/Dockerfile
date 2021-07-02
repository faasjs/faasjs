FROM mcr.microsoft.com/vscode/devcontainers/base:alpine

RUN sed -i "s@http://dl-cdn.alpinelinux.org/@https://repo.huaweicloud.com/@g" /etc/apk/repositories
RUN apk add nodejs yarn npm

RUN npm config set registry https://repo.huaweicloud.com/repository/npm/
RUN yarn config set registry https://mirrors.huaweicloud.com/repository/npm/
RUN yarn global add eslint

RUN sed -i "s/ZSH_THEME=\"codespaces\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc
RUN sed -i "s/plugins=(git)/plugins=(git yarn)/" /root/.zshrc
RUN sed -i -e "s/bin\/ash/bin\/zsh/" /etc/passwd
