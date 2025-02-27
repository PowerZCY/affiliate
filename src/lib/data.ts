import fs from 'fs'
import path from 'path'
import * as jsonc from 'jsonc-parser';

interface CategoryMeta {
    name: string;        // 分类名称
    src: string;         // 数据源文件
    description: string; // 分类描述
    link: string;        // 分类链接
}

export interface Tool {
    name: string;        // 工具名称
    description: string; // 工具描述
    url: string;         // 工具链接（改为 url）
    tags?: string[];     // 添加标签支持
    icon_url?: string;   // 工具图标（原 logo）
}

// 解析并验证数据结构
const parseAndValidate = (data: any, metaPath: string): CategoryMeta[] => {
    if (!Array.isArray(data)) {
        console.error(`Category data parse failed: ${metaPath}`);
        return [];
    }

    // 映射并验证每个分类对象
    return data.map(item => ({
        name: item.name || '',
        src: item.src || '',
        description: item.description || '',
        link: item.link || ''
    }));
};

// 获取分类元数据
export function getCategoryMetaList(locale: string): CategoryMeta[] {
    const metaPath = fetchDefaultMetaPath(locale);
    const originJSON = jsonc.parse(fs.readFileSync(metaPath, 'utf8'));
    let resultList: CategoryMeta[] = [];
    if (typeof originJSON === 'string') {
        try {
            resultList = parseAndValidate(jsonc.parse(originJSON), metaPath);
        } catch (error) {
            console.error(`Category meta parse failed: ${metaPath}`, error);
        }
    } else {
        resultList = parseAndValidate(originJSON, metaPath);
    }
    return sortByName(resultList);
}

// 添加排序函数
function sortByName<T extends { name: string }>(list: T[]): T[] {
    if (!Array.isArray(list) || list.length <= 1) {
        return [];
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

function fetchDefaultMetaPath(locale: string): string {
    return fetchMetaPath(locale, 'category.jsonc');
}

function fetchMetaPath(locale: string, srcName: string): string {
    return path.join(process.cwd(), 'data', 'json', locale, 'tools', srcName);
}

// 根据link获取指定分类元数据
export function getCategoryByLink(link: string, locale: string): CategoryMeta | undefined {
    const metaList = getCategoryMetaList(locale);
    return metaList.find(category => category.link === link);
}

// 根据src(分类文件名)获取指定分类下的数据列表
export function getToolList(srcName: string, locale: string): Tool[] {
    const targetCategoryPath = fetchMetaPath(locale, srcName);

    // 解析并验证数据结构
    const parseAndValidate = (data: any, metaPath: string): Tool[] => {
        if (!Array.isArray(data)) {
            console.error(`Category data parse failed: ${metaPath}`);
            return [];
        }

        // 映射并验证每个分类对象
        return data.map(item => ({
            name: item.name || '',
            description: item.description || '',
            url: item.url || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            icon_url: item.logo || ''
        }));
    };

    const originJSON = jsonc.parse(fs.readFileSync(targetCategoryPath, 'utf8'));
    let resultList: Tool[] = [];
    if (typeof originJSON === 'string') {
        try {
            resultList = parseAndValidate(jsonc.parse(originJSON), targetCategoryPath);
        } catch (error) {
            console.error(`Target category data parse failed: ${targetCategoryPath}`, error);
        }
    } else {
        resultList = parseAndValidate(originJSON, targetCategoryPath);
    }
    return sortByName(resultList);
}

export function searchToolByKeyword(keyword: string, locale: string): Tool[] {
    try {
        const metaList = getCategoryMetaList(locale);
        return metaList
            .flatMap(category => {
                const dataList = getToolList(category.src, locale);
                return Array.isArray(dataList) ? dataList : [];
            })
            .filter(item =>
                item.name.toLowerCase().includes(keyword.toLowerCase())
            );

    } catch (error) {
        console.error(`Search tool by keyword ${keyword} failed: `, error);
        return [];
    }
}

// 读取更新日志
export function getChangelog() {
    const dataPath = path.join(process.cwd(), 'data', 'json', 'changelog.jsonc');
    const dataList = jsonc.parse(fs.readFileSync(dataPath, 'utf8'));
    return dataList;
}
