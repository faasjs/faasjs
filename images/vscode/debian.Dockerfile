FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends sudo zsh rsync zip python3 make g++ wget curl gnupg \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/* \
  && echo "node ALL=(ALL) NOPASSWD: ALL" >/etc/sudoers.d/node \
  && chmod 0440 /etc/sudoers.d/node

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get install -y nodejs=20.* \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /home

RUN rm -rf /root/.oh-my-zsh && sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"

RUN sed -i "s/ZSH_THEME=\"codespaces\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc

RUN git clone --depth=1 https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
RUN git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
RUN git clone --depth=1 https://github.com/MichaelAquilina/zsh-you-should-use.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/you-should-use
RUN git clone --depth=1 https://github.com/zfben/zsh-npm.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-npm
RUN git clone --depth=1 https://github.com/zfben/zsh-bun.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-bun
RUN sed -i "s/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions zsh-history-substring-search zsh-syntax-highlighting you-should-use zsh-npm zsh-bun)/" /root/.zshrc

RUN corepack enable
RUN npm install -g npm@latest

RUN curl -fsSL https://bun.sh/install | bash
