#!/bin/bash

# 检查是否传入了目录参数
if [ $# -eq 0 ]; then
    echo "Please provide a folder path."
    exit 1
fi

# 获取传入的文件夹路径
folder_path="$1"

# 检查传入的路径是否为有效的目录
if [ ! -d "$folder_path" ]; then
    echo "Invalid folder path."
    exit 1
fi

# 遍历指定文件夹下的所有图片文件（这里假设处理常见的图片格式，如 .png、.jpg、.jpeg）
for file in "$folder_path"/*.{png,jpg,jpeg}; do
    # 检查文件是否存在，避免因通配符未匹配到文件而出现错误
    if [ -f "$file" ]; then
        # 获取原文件名（不包含扩展名）
        filename=$(basename "$file" "${file##*.}")
        # 构建输出的 WebP 文件名
        output_file="${filename%.*}.webp"
        # 执行 cwebp 命令进行图片转换，设置质量为 80
        cwebp -q 80 "$file" -o "$output_file"
        # 输出转换信息，方便查看进度
        echo "Converted $file to $output_file"
    fi
done