#!/bin/bash

# 设置错误处理
set -e
trap 'cleanup $?' EXIT

# 清理函数
cleanup() {
    local exit_code=$1
    # 如果临时文件存在则删除
    [ -f "$temp_file" ] && rm -f "$temp_file"
    exit $exit_code
}

# 检查参数
if [ $# -ne 1 ]; then
    echo "Usage: $0 <markdown_file>"
    exit 1
fi

# 检查文件扩展名
if [[ ! $1 =~ \.md$ ]]; then
    echo "Error: Only .md files are supported"
    exit 1
fi

# 检查文件是否存在
if [ ! -f "$1" ]; then
    echo "Error: File not found: $1"
    exit 1
fi

# 创建临时文件
temp_file=$(mktemp)

# 获取文件名（不含扩展名）和当前日期
filename=$(basename "$1" .md)
current_date=$(date +"%Y-%m-%d")

# 创建头部内容
header="---
id: \"$filename\"
title: \"🍎🍏🍎🍏🍺🍎🍏🍎🍏🍺\"
slug: \"$filename\"
excerpt: \"XXXX\"
tags: [\"productUpdates\", \"tutorials\", \"makeMoney\", \"roadOverSea\", \"insights\"]
author:
  name: \"帝八哥\"
  avatar: \"/images/default.webp\"
publishedAt: \"$current_date\"
imageUrl: \"/images/default.webp\"
featured: false
---"

# 检查文件是否已经包含头部信息
if grep -q "^---$" "$1"; then
    echo "Warning: File already contains frontmatter, skipping..."
    exit 0
fi

# 写入新内容
echo "$header" > "$temp_file"
echo "" >> "$temp_file"
echo "" >> "$temp_file"
cat "$1" >> "$temp_file"

# 替换原文件
mv "$temp_file" "$1"

echo "Successfully added header to $1"