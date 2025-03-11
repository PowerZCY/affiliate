'use client'

import { JetBrainsSearch } from '@/components/JetBrainsSearch';
import { CategoryGrid } from '@/components/CategoryGrid';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CategoryMeta, CacheData } from '@/lib/data';

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
      {/* Hero Section，俏标题·引人入胜 - 增加内容间距 */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container relative z-10 py-8 md:py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="hero-text-gradient text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                AI·Affiliate
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-normal mt-6">
                {t('h2')}
              </h2>
              {/* 搜索框容器 - 增加最大宽度 */}
              <div className="max-w-3xl mx-auto mt-8 relative z-20">
                <JetBrainsSearch onSearch={handleSearch} initialKeyword={searchKeyword} />
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
                {t('description')}
              </p>
            </div>
          </div>

          {/* 背景装饰 */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-background/5 backdrop-blur-3xl" />
          </div>
        </div>
      </section>

      {/* 分类区域 - 减少上下内边距 */}
      <section className="py-6">
        <div className="container">
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