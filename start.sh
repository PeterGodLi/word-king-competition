#!/bin/bash

# 单词王比赛 - 启动脚本

echo "================================"
echo "🏆 单词王比赛 - 启动中..."
echo "================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    echo "请先安装 Python 3: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python 版本: $(python3 --version)"
echo ""

# 检查是否需要生成示例文件
if [ ! -f "完整示例单词库.xlsx" ]; then
    echo "📝 检测到未生成示例Excel文件"
    read -p "是否生成示例文件？(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 生成示例文件中..."
        python3 生成示例Excel.py
        echo ""
    fi
fi

# 启动服务器
echo "🚀 启动 HTTP 服务器..."
echo ""
echo "================================"
echo "✅ 服务器已启动！"
echo "================================"
echo ""
echo "📱 访问地址:"
echo "   http://localhost:8000"
echo "   http://127.0.0.1:8000"
echo ""
echo "🌐 如需局域网访问，使用:"
echo "   http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):8000"
echo ""
echo "🛑 按 Ctrl+C 停止服务器"
echo "================================"
echo ""

# 启动服务器
python3 -m http.server 8000
