#!/bin/bash

echo "=========================================="
echo "     ToolHub 生产环境部署脚本"
echo "=========================================="

REQUIRED_NODE_VERSION="22.16"

# 检查是否为 Ubuntu/Debian 系统
if [ -f /etc/lsb-release ] || grep -qi ubuntu /etc/os-release 2>/dev/null; then
  echo "[信息] 检测到 Ubuntu/Debian 系统，开始系统更新..."
  
  # 系统更新
  echo "[信息] 更新系统包..."
  sudo apt update && sudo apt upgrade -y || { echo "[错误] 系统更新失败"; exit 1; }
  
  # 检查并安装 nvm
  if ! command -v nvm >/dev/null 2>&1; then
    echo "[信息] 未检测到 nvm，正在安装..."
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    
    # 更新 source
    echo "[信息] 更新环境变量..."
    source ~/.bashrc
    
    # 加载 nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  else
    echo "[信息] nvm 已安装，加载环境..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
  fi
  
  # 安装 Node.js
  echo "[信息] 安装 Node.js $REQUIRED_NODE_VERSION..."
  nvm install $REQUIRED_NODE_VERSION || { echo "[错误] Node.js 安装失败"; exit 1; }
  nvm use $REQUIRED_NODE_VERSION || { echo "[错误] Node.js 切换失败"; exit 1; }
  nvm alias default $REQUIRED_NODE_VERSION
  
  # 安装 PM2
  echo "[信息] 安装 PM2..."
  npm install pm2 -g || { echo "[错误] PM2 安装失败"; exit 1; }
  
  # 安装 nginx 及 Brotli 压缩模块
  echo "[信息] 安装 nginx 及 ngx_brotli 模块..."
  sudo apt install nginx libnginx-mod-brotli -y || { echo "[错误] nginx 安装失败"; exit 1; }

else
  echo "[错误] 此脚本仅支持 Ubuntu/Debian 系统。请手动安装所需依赖。"
  exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | sed 's/v//')
if [[ ! "$NODE_VERSION" =~ ^$REQUIRED_NODE_VERSION ]]; then
  echo "[错误] Node.js 版本应为 $REQUIRED_NODE_VERSION.x，当前为 $NODE_VERSION。"
  exit 1
fi

# 检查 Ruby
if ! command -v ruby >/dev/null 2>&1; then
  echo "[信息] 未检测到 Ruby，正在安装..."
  sudo apt update && sudo apt install -y ruby-full || { echo "[错误] Ruby 安装失败"; exit 1; }
fi

# 检查 syntax_tree gem
if ! gem list syntax_tree -i >/dev/null 2>&1; then
  echo "[信息] 未检测到 syntax_tree gem，正在安装..."
  gem install syntax_tree || { echo "[错误] 安装 syntax_tree 失败"; exit 1; }
fi

echo ""
echo "=========================================="
echo "         环境检查完成，开始构建"
echo "=========================================="

# 安装 Node 依赖
if [ -f package.json ]; then
  echo "[信息] 安装 Node 依赖..."
  npm run install-all || { echo "[错误] npm install 失败"; exit 1; }
fi

# 构建前端项目（生产环境优化）
echo "[信息] 构建前端项目（生产环境优化）..."
echo "  - 代码压缩和混淆"
echo "  - 移除 console 和 debugger"
echo "  - 代码分割和懒加载"
echo "  - CSS 分离和压缩"
npm run build:prod || { echo "[错误] 前端构建失败"; exit 1; }

echo "[信息] 所有依赖安装完成！"
echo "[信息] 已安装的组件："
echo "  - Node.js: $(node -v)"
echo "  - npm: $(npm -v)"
echo "  - PM2: $(pm2 -v)"
echo "  - nginx: $(nginx -v 2>&1)"
if nginx -V 2>&1 | grep -q 'brotli' || [ -f /usr/lib/nginx/modules/ngx_http_brotli_filter_module.so ]; then
  echo "  - ngx_brotli: 已安装 ✅（Brotli 静态预压缩已启用）"
else
  echo "  - ngx_brotli: 未安装 ⚠️（Brotli 压缩已自动禁用，使用 Gzip 压缩）"
fi
echo "  - Ruby: $(ruby -v)"

echo ""
echo "=========================================="
echo "         检查 SSL 证书文件"
echo "=========================================="

# 检查 SSL 证书文件
if [ ! -f "toolhub.studio.crt" ]; then
    echo "[警告] 未找到 SSL 证书文件 toolhub.studio.crt"
    echo "请参考 SSL_SETUP.md 创建证书文件"
    echo "将继续使用 HTTP 部署..."
    SSL_ENABLED=false
else
    echo "[信息] 找到 SSL 证书文件"
    SSL_ENABLED=true
fi

if [ ! -f "toolhub.studio.key" ]; then
    echo "[警告] 未找到 SSL 私钥文件 toolhub.studio.key"
    echo "请参考 SSL_SETUP.md 创建私钥文件"
    echo "将继续使用 HTTP 部署..."
    SSL_ENABLED=false
else
    echo "[信息] 找到 SSL 私钥文件"
fi

if [ "$SSL_ENABLED" = true ]; then
    echo "[信息] 设置 SSL 文件权限..."
    chmod 644 toolhub.studio.crt
    chmod 600 toolhub.studio.key
    sudo chown root:root toolhub.studio.crt 2>/dev/null || true
    sudo chown root:root toolhub.studio.key 2>/dev/null || true
    echo "[信息] SSL 证书配置完成，将启用 HTTPS"
fi

echo ""
echo "=========================================="
echo "         开始部署和启动服务"
echo "=========================================="

# 停止可能存在的旧进程
echo "[信息] 停止旧的 PM2 进程..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# 使用 PM2 启动应用（生产环境）
echo "[信息] 启动 PM2 进程（生产环境）..."
pm2 start ecosystem.config.js --only toolhub-production

# 配置 Nginx
echo "[信息] 配置 Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/toolhub
sudo ln -sf /etc/nginx/sites-available/toolhub /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 检测 ngx_brotli 模块是否可用，不可用则注释掉相关指令避免启动失败
echo "[信息] 检测 Brotli 模块可用性..."
if ! nginx -V 2>&1 | grep -q 'brotli' && [ ! -f /usr/lib/nginx/modules/ngx_http_brotli_filter_module.so ]; then
    echo "[警告] ngx_brotli 模块未安装，自动禁用 nginx.conf 中的 Brotli 指令..."
    sudo sed -i 's/^\(\s*brotli_static\)/#\1/' /etc/nginx/sites-available/toolhub
    sudo sed -i 's/^\(\s*brotli on\)/#\1/' /etc/nginx/sites-available/toolhub
else
    echo "[信息] ngx_brotli 模块可用，Brotli 压缩已启用"
fi

# 测试 Nginx 配置
echo "[信息] 测试 Nginx 配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "[信息] Nginx 配置正确，重启服务..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    echo "[错误] Nginx 配置有误，请检查配置文件"
    exit 1
fi

# 设置防火墙
echo "[信息] 配置防火墙..."
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw --force enable

# 设置 PM2 开机自启
echo "[信息] 设置 PM2 开机自启..."
pm2 save
pm2 startup

echo ""
echo "=========================================="
echo "            部署完成！"
echo "=========================================="
echo ""
echo "应用状态："
pm2 status
echo ""
echo "Nginx 状态："
sudo systemctl status nginx --no-pager -l
echo ""
echo "端口配置："
echo "  - 前端端口: 4173 (构建后)"
echo "  - 后端端口: 3000"
echo "  - Nginx端口: 80"
echo ""
echo "您的应用现在可以通过以下方式访问："
if [ "$SSL_ENABLED" = true ]; then
    echo "HTTPS: https://toolhub.studio (推荐)"
    echo "HTTP: http://toolhub.studio (自动重定向到 HTTPS)"
else
    echo "HTTP: http://toolhub.studio"
    echo "⚠️  建议配置 SSL 证书启用 HTTPS"
fi
echo ""
echo "📋 重要提示："
echo "1. 域名已配置为: toolhub.studio"
if [ "$SSL_ENABLED" = true ]; then
    echo "2. ✅ HTTPS 已启用，SSL 证书配置完成"
else
    echo "2. ❌ HTTPS 未启用，请参考 SSL_SETUP.md 配置证书"
fi
echo "3. 常用命令："
echo "   - 查看状态: pm2 status"
echo "   - 重启应用: pm2 restart toolhub-production"
echo "   - 查看日志: pm2 logs toolhub-production"
echo "   - 重启 Nginx: sudo systemctl restart nginx"
echo "4. 证书文件位置："
echo "   - 证书: $(pwd)/toolhub.studio.crt"
echo "   - 私钥: $(pwd)/toolhub.studio.key"
echo "==========================================" 