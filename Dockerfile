FROM mcr.microsoft.com/devcontainers/base:debian

RUN  apt update -y && apt install -y \
        libwebkit2gtk-4.0-dev        \
        build-essential              \
        curl                         \
        wget                         \
        file                         \
        libssl-dev                   \
        libgtk-3-dev                 \
        libayatana-appindicator3-dev \
        librsvg2-dev                 \
     && apt clean                    \
     && rm -rf /var/lib/apt/lists/*
