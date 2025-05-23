'use client'

import { CategoryGrid } from '@/components/CategoryGrid';
import { JetBrainsSearch } from '@/components/JetBrainsSearch';
import { CacheData, CategoryMeta } from '@/lib/data';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

// 缓存相关的工具函数
const cacheUtils = {
  getCache: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = sessionStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.error('[Categories] Error reading from sessionStorage:', e);
      return null;
    }
  },

  setCache: (key: string, data: CacheData) => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('[Categories] Error writing to sessionStorage:', e);
    }
  }
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('home');
  const isFetching = useRef(false);

  useEffect(() => {
    // 客户端获取分类数据
    const fetchCategories = async () => {
      const cacheKey = `categories-${locale}`;

      // 如果正在获取数据，直接返回
      if (isFetching.current) {
        console.log(`[Categories] Skip duplicate request - fetch in progress for locale: ${locale}`);
        return;
      }

      // 检查 sessionStorage 中是否已有数据
      const cachedData = cacheUtils.getCache(cacheKey);
      if (cachedData) {
        console.log(`[Categories] Using cached data from sessionStorage for locale: ${locale}`);
        setCategories(cachedData);
        setIsLoading(false);
        return;
      }

      console.log(`[Categories] Start fetching categories for locale: ${locale}`);
      setIsLoading(true);
      isFetching.current = true;

      try {
        // 获取分类数据
        const response = await fetch(`/api/categories?locale=${locale}`);
        const data = await response.json();

        if (data.categories) {
          console.log(`[Categories] Successfully fetched ${data.categories.length} categories for locale: ${locale}`);
          // 更新 sessionStorage 缓存和状态
          cacheUtils.setCache(cacheKey, data.categories);
          setCategories(data.categories);
        } else {
          console.error(`[Categories] Failed to fetch categories for locale: ${locale} - invalid response format`);
        }
      } catch (error) {
        console.error(`[Categories] Error fetching categories for locale: ${locale}:`, error);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    fetchCategories();
  }, [locale]);

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchKeyword('');
  };

  // 处理分类选择
  const handleCategorySelect = (category: string | null) => {
    // 如果选择了分类，清空搜索关键词
    if (category !== null) {
      setSearchKeyword('');
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container relative z-10 flex items-center justify-center min-h-[70vh]">
          <div className="max-w-4xl mx-auto">
            {/* 文本内容 */}
            <div className="space-y-6 text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="animate-text-gradient bg-gradient-to-r from-[#A78BFA] via-[#818CF8] to-[#F472B6] bg-clip-text text-transparent bg-300% selection:bg-transparent">
                  {t('h1')}
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-normal">
                {t('h2')}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {t('description')}
              </p>

              {/* 搜索框 */}
              <div className="mt-6 max-w-2xl mx-auto">
                <JetBrainsSearch onSearch={handleSearch} initialKeyword={searchKeyword} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类区域 - 减少上下内边距 */}
      <section className="py-6">
        <div className="container max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4">{t('loading')}</p>
            </div>
          ) : (
            <CategoryGrid
              categories={categories}
              searchKeyword={searchKeyword}
              onCategorySelect={handleCategorySelect}
              onSearchClear={clearSearch}
            />
          )}
        </div>
      </section>
    </main>
  )
}