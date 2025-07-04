#!/bin/bash

# SEO 文件访问测试脚本

echo "🔍 测试 SEO 文件访问性..."
echo "=================================="

# 测试域名
DOMAIN="https://toolhub.studio"

# 测试 robots.txt
echo "📋 测试 robots.txt..."
echo "URL: $DOMAIN/robots.txt"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$DOMAIN/robots.txt"
echo ""

# 测试 sitemap.xml
echo "🗺️ 测试 sitemap.xml..."
echo "URL: $DOMAIN/sitemap.xml"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$DOMAIN/sitemap.xml"
echo ""

# 测试本地开发环境
echo "🔧 测试本地开发环境..."
echo "=================================="

# 检查文件是否存在
echo "📁 检查文件是否存在..."
if [ -f "toolhub/public/robots.txt" ]; then
    echo "✅ robots.txt 存在"
else
    echo "❌ robots.txt 不存在"
fi

if [ -f "toolhub/public/sitemap.xml" ]; then
    echo "✅ sitemap.xml 存在"
else
    echo "❌ sitemap.xml 不存在"
fi

echo ""

# 测试本地预览服务器
echo "🌐 测试本地预览服务器 (localhost:4173)..."
LOCAL_URL="http://localhost:4173"

echo "测试 $LOCAL_URL/robots.txt"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$LOCAL_URL/robots.txt" 2>/dev/null || echo "❌ 无法连接到本地服务器"

echo "测试 $LOCAL_URL/sitemap.xml"
curl -s -o /dev/null -w "HTTP状态码: %{http_code}\n" "$LOCAL_URL/sitemap.xml" 2>/dev/null || echo "❌ 无法连接到本地服务器"

echo ""
echo "📝 说明："
echo "- HTTP 200: 文件可正常访问"
echo "- HTTP 404: 文件未找到"
echo "- HTTP 502/503: 服务器配置问题"
echo "- 连接错误: 服务器未启动"
echo ""
echo "🚀 如需启动本地预览服务器，请运行："
echo "   cd toolhub && npm run preview" 