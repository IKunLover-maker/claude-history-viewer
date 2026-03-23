#!/bin/bash

# 部署脚本 - 适用于 Linux 服务器

echo "=== Claude Code History Viewer 部署脚本 ==="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo "✅ npm 版本: $(npm -v)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

# 启动服务
echo ""
echo "🚀 启动服务..."
echo "应用将在 http://localhost:3000 运行"
echo "按 Ctrl+C 停止服务"

npm start
