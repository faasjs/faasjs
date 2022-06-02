FROM node:current-alpine

RUN apk add --no-cache git zsh openssh rsync zip

RUN sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"

RUN sed -i "s/ZSH_THEME=\"codespaces\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc
RUN sed -i -e "s/bin\/ash/bin\/zsh/" /etc/passwd

RUN git clone --depth=1 https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
RUN git clone --depth=1 https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
RUN sed -i "s/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions zsh-history-substring-search)/" /root/.zshrc

RUN git clone --depth=1 https://github.com/zfben/zsh-npm.git ~/.zsh-npm
RUN echo "source /root/.zsh-npm/npm.plugin.zsh" >> /root/.zshrc

RUN corepack enable
RUN npm install -g npm@latest
