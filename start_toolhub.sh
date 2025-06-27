#!/bin/bash

REQUIRED_NODE_VERSION="22.16.0"

# 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[信息] 未检测到 Node.js，尝试自动安装..."
  if [ -f /etc/lsb-release ] || grep -qi ubuntu /etc/os-release 2>/dev/null; then
    # 检查 nvm
    if ! command -v nvm >/dev/null 2>&1; then
      echo "[信息] 未检测到 nvm，正在安装..."
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    else
      export NVM_DIR="$HOME/.nvm"
      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    nvm install $REQUIRED_NODE_VERSION && nvm use $REQUIRED_NODE_VERSION && nvm alias default $REQUIRED_NODE_VERSION
  else
    echo "[错误] 请手动安装 Node.js $REQUIRED_NODE_VERSION。"
    exit 1
  fi
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | sed 's/v//')
if [ "$NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
  echo "[错误] Node.js 版本必须为 $REQUIRED_NODE_VERSION，当前为 $NODE_VERSION。"
  exit 1
fi

# 检查 npm
if ! command -v npm >/dev/null 2>&1; then
  echo "[信息] 未检测到 npm，尝试自动安装..."
  if [ -f /etc/lsb-release ] || grep -qi ubuntu /etc/os-release 2>/dev/null; then
    sudo apt update && sudo apt install -y npm || { echo "[错误] npm 安装失败"; exit 1; }
  else
    echo "[错误] 请手动安装 npm。"
    exit 1
  fi
fi

# 检查 Ruby
if ! command -v ruby >/dev/null 2>&1; then
  echo "[信息] 未检测到 Ruby，尝试自动安装..."
  if [ -f /etc/lsb-release ] || grep -qi ubuntu /etc/os-release 2>/dev/null; then
    sudo apt update && sudo apt install -y ruby-full || { echo "[错误] Ruby 安装失败"; exit 1; }
  else
    echo "[错误] 请手动安装 Ruby。"
    exit 1
  fi
fi

# 检查 syntax_tree gem
if ! gem list syntax_tree -i >/dev/null 2>&1; then
  echo "[信息] 未检测到 syntax_tree gem，正在安装..."
  gem install syntax_tree || { echo "[错误] 安装 syntax_tree 失败"; exit 1; }
fi

# 安装 Node 依赖
if [ -f package.json ]; then
  echo "[信息] 安装 Node 依赖..."
  npm run install-all || { echo "[错误] npm install 失败"; exit 1; }
fi

# 启动项目
npm run start 