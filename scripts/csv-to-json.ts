/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import pLimit from 'p-limit';
import { Tool } from '../src/lib/data';
import { appConfig } from '../src/lib/appConfig';
import { HttpsProxyAgent } from 'https-proxy-agent';

interface CsvDataTool extends Tool {
    originDescription?: string;
    signed: boolean;
}

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

function mock(tool: CsvDataTool): CsvDataTool {
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
const toolsByCategoryAndLocale: Record<string, Record<string, CsvDataTool[]>> = {};
supportedLocales.forEach(locale => {
    toolsByCategoryAndLocale[locale] = {};
});

// 用于检测重复 ID
const idMap = new Map<string, string>();

// 读取并解析 CSV 文件
// 添加网站元数据获取函数
async function fetchWebsiteMetadata(url: string): Promise<string | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000, // 10秒超时
            agent: process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 检查内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            return '';
        }

        const html = await response.text();
        // 配置 JSDOM 选项来禁用控制台输出
        const dom = new JSDOM(html, {
            runScripts: 'outside-only',
            virtualConsole: new (require('jsdom').VirtualConsole)()
        });

        const document = dom.window.document;

        // 按优先级获取描述信息
        const description =
            document.querySelector('meta[name="description"]')?.getAttribute('content') ||
            document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
            document.querySelector('meta[name="twitter:description"]')?.getAttribute('content');

        return description || '';
    } catch (error: any) {
        const errorMessage = error.code || error.message || 'unknown error';
        console.error(`Fetch target website failed: ${url}, `, errorMessage);
        return '';
    }
}

// 添加批量处理函数
async function processWrap(tools: CsvDataTool[]): Promise<void> {
    const limit = pLimit(5);
    const metadataMap = new Map<string, string>();
    const retryLimit = 3;

    const fetchWithRetry = async (url: string, attempts = 0): Promise<string | null> => {
        try {
            const metadata = await fetchWebsiteMetadata(url);
            return metadata;
        } catch (error: any) {
            const errorMessage = error.code || error.message || 'unknown error';
            console.log(`Fetch target website failed: ${url}, ${errorMessage}`);
            if (attempts < retryLimit) {
                console.log(`Retry fetching meta: ${url}, (${attempts + 1}/${retryLimit})`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)));
                return fetchWithRetry(url, attempts + 1);
            }
            return null;
        }
    };

    const promises = tools.map(tool => {
        if (tool.signed) {
            console.log(`✅ Skip signed tool: ${tool.id}: ${tool.name}: ${tool.url}`);
            return Promise.resolve();
        }

        return limit(async () => {
            const metadata = await fetchWithRetry(tool.url);
            if (metadata) {
                metadataMap.set(tool.url, metadata);
                console.log(`✅ Fetched metadata for: ${tool.id}: ${tool.name}`);
            }
        });
    });

    await Promise.all(promises.filter(Boolean));
    tools.forEach(tool => {
        const metadata = metadataMap.get(tool.url);
        if (metadata) {
            tool.signed = true;
            tool.originDescription = metadata;
            if (tool.description) {
                tool.description = `${tool.description} | ${metadata}`;
            } else {
                tool.description = metadata;
            }
        }
    });
}

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
        const tool: CsvDataTool = {
            id: row['id'],
            name: row.name,
            description: row.description,
            originDescription: '', // 添加新字段
            url: row.url,
            homeImg: `${row['id']}.webp`,
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
            signed: row.signed === 'TRUE',
        };

        const toolDataByEnv = appConfig.tool.mockData ? mock(tool) : tool;
        // 为每种语言创建工具对象
        supportedLocales.forEach(locale => {
            // 将工具添加到相应的分类和语言中
            if (!toolsByCategoryAndLocale[locale][category]) {
                toolsByCategoryAndLocale[locale][category] = [];
            }
            toolsByCategoryAndLocale[locale][category].push(toolDataByEnv);
        });
    })
    .on('end', async () => {
        try {
            if (appConfig.tool.mockData) {
                console.log('Begin spider...');
                // 使用 Map 来存储唯一的工具，以 id 为键
                const uniqueTools = new Map<string, CsvDataTool>();

                // 遍历所有工具数据，只保留每个 ID 的第一个实例
                supportedLocales.forEach(locale => {
                    Object.entries(toolsByCategoryAndLocale[locale]).forEach(([category, tools]) => {
                        tools.forEach(tool => {
                            if (!uniqueTools.has(tool.id)) {
                                uniqueTools.set(tool.id, tool);
                            }
                        });
                    });
                });

                // 转换为数组
                const toolsBuffer = Array.from(uniqueTools.values());
                console.log(`✅ Total ${toolsBuffer.length} tools need to fetch metadata`);
                // 批量获取元数据
                await processWrap(toolsBuffer);
            }
            // 写入文件
            supportedLocales.forEach(locale => {
                const localeOutputDir = path.join(process.cwd(), 'data', 'json', "tmp", locale, 'tools');
                Object.entries(toolsByCategoryAndLocale[locale]).forEach(([category, tools]) => {
                    // 确保目录存在
                    const outputPath = path.join(localeOutputDir, `${category}.jsonc`);
                    tools.sort((a, b) => Number(a.id) - Number(b.id));
                    fs.writeFileSync(outputPath, JSON.stringify(tools, null, 2));
                    console.log(`✅ Create ${locale}/${category}.jsonc，include ${tools.length} tools`);
                });
            });

            console.log('🎉 All locales data have been processed!');
        } catch (error: any) {
            const errorMessage = error.code || error.message || 'unknown error';
            console.error('Fetch target website failed: ', errorMessage);
        }
    });