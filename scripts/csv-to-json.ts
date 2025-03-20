/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Tool } from '../src/lib/data';
import { appConfig } from '../src/lib/appConfig';

// 检查文件编码并转换为 UTF-8
// 在文件顶部添加数据处理函数
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

function mock(tool: Tool): Tool {
    tool.tags = dataProcessor.processTags(tool.tags?.join(','));
    tool.salePrice = dataProcessor.processSalePrice(tool.price ? tool.price : 0, tool.salePrice ? tool.salePrice : 0);
    tool.star = dataProcessor.processStar(tool.star);
    tool.like = dataProcessor.processLike(tool.like, tool.traffic);
    return tool;
}

// 数据随机预处理规则
const dataProcessor = {
    // 处理标签：原始数据不存在或为空时，随机选取1-3个标签
    processTags: (tags: string | undefined): string[] => {
        if (tags && tags.trim() !== '') {
            return tags.split(',').map(tag => tag.trim());
        }

        const availableTags = [
            'Apple', 'Bytedance', 'Claude', 'DeepSeek', 'Ebay',
            'Facebook', 'Google', 'HugFace', 'IG', 'JetBrains'
        ];

        // 随机选择1-3个标签
        const count = Math.floor(Math.random() * 3) + 1;
        const selectedTags: string[] = [];

        while (selectedTags.length < count) {
            const randomIndex = Math.floor(Math.random() * availableTags.length);
            const tag = availableTags[randomIndex];
            if (!selectedTags.includes(tag)) {
                selectedTags.push(tag);
            }
        }

        return selectedTags;
    },

    // 处理促销价格：原始数据不存在时，随机生成
    processSalePrice: (originalPrice: number, salePrice: number): number => {
        if (!originalPrice || originalPrice < 0) {
            return -1;
        }
        if (salePrice && salePrice !== -1) {
            return parseFloat(salePrice.toFixed(2));
        }

        // 50%概率返回0（无促销）
        if (Math.random() < 0.1) return 0;

        // 生成原价的0-100%的随机价格
        return parseFloat((Math.random() * originalPrice).toFixed(2))
    },

    // 处理评分：原始数据不存在时，生成1-5之间的随机值
    processStar: (star: number): number => {
        if (star && star !== 0) {
            return parseFloat(star.toFixed(1));
        }

        // 生成1到5之间的随机数，保留1位小数; 0.2到1之间
        const randomFactor = 0.2 + Math.random() * 0.8;
        return parseFloat((5 * randomFactor).toFixed(1));
    },

    // 处理点赞数：原始数据不存在时，生成50-9999之间的随机值
    processLike: (like: number, traffic: number): number => {
        if (like && like !== 0) {
            return parseInt(String(like));
        }

        if (!traffic || traffic < 1000) {
            return Math.floor(Math.random() * (10 + 1))
        }
        const limit = Math.floor(traffic / 1000) + 50;
        // 生成50到9999之间的随机整数
        const r = Math.floor(Math.random() * limit);
        return parseInt(r.toString());
    }
};

// 获取支持的语言列表
const supportedLocales = appConfig.i18n.locales;
console.log(`🌐 Locales: ${supportedLocales.join(', ')}`);

// 为每种语言创建输出目录
supportedLocales.forEach(locale => {
    const localeOutputDir = path.join(process.cwd(), 'data', 'json', locale, 'tools');
    if (!fs.existsSync(localeOutputDir)) {
        fs.mkdirSync(localeOutputDir, { recursive: true });
        console.log(`📁 Create Dir: ${localeOutputDir}`);
    }
});

// CSV 文件路径
const csvPath = path.join(__dirname, '..', 'docs', 'data.csv');

// 先确保文件为 UTF-8 编码
ensureUTF8(csvPath);

// 用于存储按分类和语言分组的工具数据
const toolsByCategoryAndLocale: Record<string, Record<string, Tool[]>> = {};
supportedLocales.forEach(locale => {
    toolsByCategoryAndLocale[locale] = {};
});

// 用于检测重复 ID
const idMap = new Map<string, string>();

// 读取并解析 CSV 文件
fs.createReadStream(csvPath)
    .pipe(parse({ columns: true, skip_empty_lines: true }))
    .on('data', (row: any) => {
        // 检查 ID 是否重复
        if (idMap.has(row['id'])) {
            console.log(`⚠️ Found invalid repeat ID: ${row['id']}::${idMap.get(row['id'])} 与 ${row['id']}::${row.name}`);
        } else {
            idMap.set(row['id'], row.name);
        }

        // 提取分类
        const category = row.category;
        if (!category) return;

        // 创建基本的工具对象
        const tool: Tool = {
            id: row['id'],
            name: row.name,
            description: row.description,
            url: row.url,
            homeImg: `${row['id']}.webp`, // 设置 banner 图片路径
            iconUrl: row.iconUrl || '',
            tags: Array.isArray(row.tags) ? row.tags : [],
            submit: row.submit === 'TRUE',
            showPrice: row.showPrice === 'TRUE',
            price: row.price ? Number(row.price) : -1,
            salePrice: row.salePrice ? Number(row.salePrice) : -1,
            hot: row.hot || '',
            star: row.star ? Number(row.star) : 0,
            traffic: row.traffic ? Number(row.traffic) : 500,
            like: row.like ? Number(row.like) : 0,
        };
        // const mockData = mock(tool)
        // 为每种语言创建工具对象
        supportedLocales.forEach(locale => {
            // 将工具添加到相应的分类和语言中
            if (!toolsByCategoryAndLocale[locale][category]) {
                toolsByCategoryAndLocale[locale][category] = [];
            }
            toolsByCategoryAndLocale[locale][category].push(tool);
        });
    })
    .on('end', () => {
        // 为每种语言和分类创建 JSONC 文件
        supportedLocales.forEach(locale => {
            const localeOutputDir = path.join(process.cwd(), 'data', 'json', locale, 'tools');

            Object.entries(toolsByCategoryAndLocale[locale]).forEach(([category, tools]) => {
                const outputPath = path.join(localeOutputDir, `${category}.jsonc`);

                // 按 id 排序（将 id 转换为数字进行比较）
                tools.sort((a, b) => Number(a.id) - Number(b.id));

                // 写入文件
                fs.writeFileSync(
                    outputPath,
                    JSON.stringify(tools, null, 2)
                );

                console.log(`✅ Create ${locale}/${category}.jsonc，include ${tools.length} tools`);
            });
        });

        console.log('🎉 All locales data have been processed!');
    });