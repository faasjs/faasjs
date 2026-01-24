FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG DEBIAN_FRONTEND=noninteractive

# Upgrade and install common packages
RUN apt-get update -y \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends sudo zsh rsync zip python3 make g++ wget curl gnupg \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/* \
  && echo "node ALL=(ALL) NOPASSWD: ALL" >/etc/sudoers.d/node \
  && chmod 0440 /etc/sudoers.d/node

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs=22.* \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /home

# Install Oh My Zsh
RUN rm -rf /root/.oh-my-zsh && sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
RUN sed -i "s/ZSH_THEME=\"codespaces\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc

# Install Oh My Zsh plugins
RUN git clone --depth=1 https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
RUN git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
RUN git clone --depth=1 https://github.com/MichaelAquilina/zsh-you-should-use.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/you-should-use
RUN git clone --depth=1 https://github.com/zfben/zsh-npm.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-npm
RUN git clone --depth=1 https://github.com/zfben/zsh-pnpm.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-pnpm
RUN git clone --depth=1 https://github.com/tamcore/autoupdate-oh-my-zsh-plugins.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/autoupdate
RUN sed -i "s/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions zsh-history-substring-search zsh-syntax-highlighting you-should-use zsh-npm zsh-pnpm autoupdate)/" /root/.zshrc

# Upgrade npm
RUN npm install -g npm@latest tsx && npm cache clean --force

# Install pnpm
ENV PNPM_HOME="/root/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Prepare the shell
RUN chsh "$(id -un)" --shell "/usr/bin/zsh"
