FROM oven/bun

RUN apt-get update -y
RUN apt-get install -y git rsync zip python3 make g++ brotli
