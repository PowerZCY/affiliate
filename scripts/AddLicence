#!/bin/bash

# 许可证声明注释
LICENSE_COMMENT='/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'

# 查找所有 .ts 和 .tsx 文件
FILES=$(find src -name "*.ts" -o -name "*.tsx")

for FILE in $FILES; do
  # 检查文件是否已经包含许可证声明
  if ! grep -q "@license" "$FILE"; then
    echo "Adding license to $FILE"
    # 创建临时文件
    TMP_FILE=$(mktemp)
    # 添加许可证声明到临时文件
    echo "$LICENSE_COMMENT" > "$TMP_FILE"
    # 添加原文件内容到临时文件
    cat "$FILE" >> "$TMP_FILE"
    # 用临时文件替换原文件
    mv "$TMP_FILE" "$FILE"
  else
    echo "License already exists in $FILE"
  fi
done

echo "License added to all TypeScript files."