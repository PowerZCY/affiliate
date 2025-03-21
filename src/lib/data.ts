/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import * as jsonc from 'jsonc-parser';
import { appConfig } from '@/lib/appConfig';

// 统一导出所有类型定义
export interface CategoryMeta {
    name: string;        // 分类名称
    src: string;         // 数据源文件
    description: string; // 分类描述
    link: string;        // 分类链接
}

export interface Tool {
    id: string;          // 产品ID
    name: string;        // 产品名称
    description: string; // 描述
    category?: string;   // 类别标识
    url: string;         // 主页链接
    homeImg?: string;    // banner图片
    iconUrl?: string;    // 工具图标
    tags?: string[];     // 标签支持
    submit: boolean;    // 是否支持提交
    showPrice: boolean; // 是否显示价格
    price?: number;      // 价格
    salePrice?: number;  // 促销价格
    hot?: string;        // 冠名标题
    star: number;       // 星级reduce
    traffic: number;    // 流量级别
    like: number;       // 点赞数
}

// 用于缓存数据的类型定义
export interface CacheData {
    categories?: CategoryMeta[];
    tools?: Tool[];
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
    return path.join(process.cwd(), appConfig.metaConfig.category.dirName, appConfig.metaConfig.category.secondDirName, appConfig.metaConfig.category.thirdDirName, locale, appConfig.metaConfig.category.coreName);
}

function fetchToolMetaPath(locale: string, srcName: string): string {
    return path.join(process.cwd(), appConfig.metaConfig.category.dirName, appConfig.metaConfig.category.secondDirName, appConfig.metaConfig.category.thirdDirName, locale, appConfig.metaConfig.category.toolDirName, srcName);
}

// 根据link获取指定分类元数据
export function getCategoryByLink(link: string, locale: string): CategoryMeta | undefined {
    const metaList = getCategoryMetaList(locale);
    return metaList.find(category => category.link === link);
}

// 根据src(分类文件名)获取指定分类下的数据列表
export function getToolList(srcName: string, locale: string): Tool[] {
    const targetCategoryPath = fetchToolMetaPath(locale, srcName);

    // 解析并验证数据结构
    const parseAndValidate = (data: any, metaPath: string): Tool[] => {
        if (!Array.isArray(data)) {
            console.error(`Category data parse failed: ${metaPath}`);
            return [];
        }

        // 映射并验证每个分类对象
        return data.map(item => ({
            id: item.id || '',
            name: item.name || '',
            description: item.description || '',
            url: item.url || '',
            homeImg: item.homeImg || '',
            iconUrl: item.iconUrl || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            submit: item.submit || false,
            showPrice: item.showPrice || false,
            price: item.price || -1,
            salePrice: item.salePrice || -1,
            hot: item.hot || '',
            star: item.star || -1,
            traffic: item.traffic || 0,
            like: item.like || 0
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
