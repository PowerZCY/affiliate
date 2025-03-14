/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Tool } from '../src/lib/data';

// 检查文件编码并转换为 UTF-8
function ensureUTF8(filePath: string): void {
    const buffer = fs.readFileSync(filePath);

    // 检查是否为 UTF-8 BOM
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log('⚠️ Found UTF-8 BOM, transforming UTF-8...');
        // 移除 BOM 标记并转换为 UTF-8 字符串
        const content = buffer.slice(3).toString('utf8');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ Data File has been transform UTF-8');
    }
}

// 创建输出目录
const outputDir = path.join(process.cwd(), 'data', 'json', 'zh', 'tools');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// CSV 文件路径
const csvPath = path.join(__dirname, '..', 'docs', 'data.csv');

// 先确保文件为 UTF-8 编码
ensureUTF8(csvPath);

// 用于存储按分类分组的工具数据
const toolsByCategory: Record<string, Tool[]> = {};
// 用于检测重复 ID
const idMap = new Map<string, string>();

// 读取并解析 CSV 文件
fs.createReadStream(csvPath)
    .pipe(parse({ columns: true, skip_empty_lines: true }))
    .on('data', (row: any) => {
        // 检查 ID 是否重复
        if (idMap.has(row['id'])) {
            console.log(`⚠️ 发现重复ID: ${row['id']}::${idMap.get(row['id'])} 与 ${row['id']}::${row.name}`);
        } else {
            idMap.set(row['id'], row.name);
        }

        // 提取分类
        const category = row.category;
        if (!category) return;

        // 创建工具对象，移除 category 字段
        const tool: Tool = {
            id: row['id'],
            name: row.name,
            description: row.description,
            url: row.url,
            homeImg: `${row['id']}.webp`, // 设置 banner 图片路径
            iconUrl: row.iconUrl || '',
            tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
            submit: row.submit === 'TRUE',
            showPrice: row.showPrice === 'TRUE',
            price: row.price === '-1' ? 0 : Number(row.price),
            salePrice: row.salePrice ? Number(row.salePrice) : 0,
            hot: row.hot || '',
            star: row.star ? Number(row.star) : 0,
            traffic: row.traffic ? Number(row.traffic) : 0,
            like: row.like ? Number(row.like) : 0
        };

        if (!toolsByCategory[category]) {
            toolsByCategory[category] = [];
        }
        toolsByCategory[category].push(tool);
    })
    .on('end', () => {
        // 为每个分类创建 JSONC 文件
        Object.entries(toolsByCategory).forEach(([category, tools]) => {
            const outputPath = path.join(outputDir, `${category}.jsonc`);

            // 按 id 排序（将 id 转换为数字进行比较）
            tools.sort((a, b) => Number(a.id) - Number(b.id));

            // 写入文件
            fs.writeFileSync(
                outputPath,
                JSON.stringify(tools, null, 2)
            );

            console.log(`✅ Created ${category}.jsonc with ${tools.length} tools`);
        });
    });