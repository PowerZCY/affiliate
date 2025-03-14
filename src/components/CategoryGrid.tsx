'use client';

import styles from '@/styles/CategoryPage.module.css';
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes'; // 如果您使用 next-themes 管理主题
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryMeta, Tool } from '@/lib/data';

// 缓存对象，用于存储已获取的工具数据
const toolsCache: Record<string, Tool[]> = {};

export function CategoryGrid({
  categories,
  searchKeyword = '',
  onCategorySelect,
  onSearchClear
}: {
  categories: CategoryMeta[],
  searchKeyword?: string,
  onCategorySelect?: (category: string | null) => void,
  onSearchClear?: () => void
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMounted = useRef(true);
  const isAllToolsFetching = useRef(false);
  const t = useTranslations('categoryGrid');
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 获取单个分类的工具数据（从缓存）
  const fetchToolsData = useCallback((src: string, categoryName: string) => {
    // console.log(`[Tools] Getting tools for category: ${categoryName}`);
    setLoading(true);

    try {
      // 从全局缓存中获取数据
      const allToolsCacheKey = `${locale}-all`;
      const allToolsCache = toolsCache[allToolsCacheKey];

      if (!allToolsCache) {
        // console.warn(`[Tools] No tools cache found for locale: ${locale}`);
        setTools([]);
        return;
      }

      // 从缓存中过滤出当前分类的工具
      const categoryTools = allToolsCache.filter(tool => tool.category === categoryName);
      // console.log(`[Tools] Found ${categoryTools.length} tools in cache for ${categoryName}`);

      // 更新工具列表
      setTools(categoryTools);
    } catch (error) {
      console.error(`[Tools] Error getting tools for category: ${categoryName}`, error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // 获取所有分类的工具数据（优先使用缓存）
  const fetchAllTools = useCallback(async () => {
    // 防止重复请求，使用locale作为key
    if (isAllToolsFetching.current) {
      console.log(`[Tools] Skip duplicate request - already fetching all tools for locale: ${locale}`);
      return;
    }

    // console.log(`[Tools] Start fetching all tools for locale: ${locale}`);
    setLoading(true);
    isAllToolsFetching.current = true;

    try {
      // 检查缓存中是否已有所有工具的数据
      if (toolsCache[`${locale}-all`]) {
        console.log(`[Tools] Using cached data for all tools in locale: ${locale}`);
        setAllTools(toolsCache[`${locale}-all`]);
        setLoading(false);
        return;
      }

      // 获取所有有src属性的分类
      const categoriesWithSrc = categories.filter(c => c.src);

      if (categoriesWithSrc.length === 0) {
        console.warn('[Tools] No categories with src property found');
        setAllTools([]);
        return;
      }

      // 检查是否所有分类都已缓存
      const allCached = categoriesWithSrc.every(category =>
        category.src && toolsCache[`${locale}-${category.src}`]
      );

      if (allCached) {
        console.log('[Tools] Using cached data for all categories');
        // 合并所有缓存的工具数据
        const allCachedTools = categoriesWithSrc.flatMap(category =>
          category.src ? toolsCache[`${locale}-${category.src}`] : []
        );

        // 去除重复项
        const uniqueTools = allCachedTools.filter((tool, index, self) =>
          index === self.findIndex(t => t.name === tool.name)
        );

        console.log(`[Tools] Successfully merged ${uniqueTools.length} unique tools from cache`);
        setAllTools(uniqueTools);

        // 更新缓存，使用语言-all作为键
        toolsCache[`${locale}-all`] = uniqueTools;
        return;
      }

      // 使用API获取所有工具
      console.log(`[Tools] Fetching all tools from API for locale: ${locale}`);
      const response = await fetch(`/api/tools?locale=${locale}`);
      const data = await response.json();

      if (data.tools && Array.isArray(data.tools)) {
        console.log(`[Tools] Successfully fetched ${data.tools.length} tools from API for locale: ${locale}`);
        setAllTools(data.tools);

        // 更新缓存，使用语言-all作为键
        toolsCache[`${locale}-all`] = data.tools;
      } else {
        console.warn(`[Tools] No tools found in API response for locale: ${locale}`);
        setAllTools([]);
      }
    } catch (error) {
      console.error(`[Tools] Failed to fetch all tools for locale: ${locale}:`, error);
    } finally {
      setLoading(false);
      isAllToolsFetching.current = false;
    }
  }, [categories, locale]);

  // 组件加载时获取所有工具
  useEffect(() => {
    const shouldFetchTools = categories.length > 0 && !isAllToolsFetching.current && !toolsCache[`${locale}-all`];

    if (shouldFetchTools) {
      console.log(`[Tools] Initial load - fetching all tools for locale: ${locale}`);
      fetchAllTools();
    } else if (toolsCache[`${locale}-all`]) {
      console.log(`[Tools] Using existing cache for locale: ${locale}`);
      setAllTools(toolsCache[`${locale}-all`]);
    }
  }, [fetchAllTools, categories, locale]);

  // 处理分类点击
  const handleCategoryClick = useCallback((categoryLink: string) => {
    console.log(`Clicking category: ${categoryLink}`);

    // 找到对应的分类对象
    const category = categories.find(c => c.link === categoryLink);

    if (!category) {
      console.error(`Category not found: ${categoryLink}`);
      return;
    }

    // 如果有搜索关键词，清空搜索
    if (searchKeyword && onSearchClear) {
      onSearchClear();
    }

    if (selectedCategory === categoryLink) {
      // 如果点击的是已选中的分类，则取消选择并显示所有工具
      setSelectedCategory(null);
      if (onCategorySelect) {
        onCategorySelect(null);
      }
    } else {
      // 选择新分类并获取数据
      setSelectedCategory(categoryLink);
      if (onCategorySelect) {
        onCategorySelect(categoryLink);
      }

      // 使用src属性获取工具数据
      if (category.src) {
        console.log(`Using category.src: ${category.src}`);
        fetchToolsData(category.src, category.name);
      } else {
        console.warn(`Category ${categoryLink} has no src property`);
        setTools([]);
      }
    }
  }, [selectedCategory, fetchToolsData, categories, searchKeyword, onSearchClear, onCategorySelect]);

  // 处理重置按钮点击
  const handleResetClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(null);
    if (onCategorySelect) {
      onCategorySelect(null);
    }
    // 同时清除搜索框内容
    if (searchKeyword && onSearchClear) {
      onSearchClear();
    }
  }, [onCategorySelect, searchKeyword, onSearchClear]);

  // 处理回到顶部按钮点击
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // 获取当前选中的分类信息
  const selectedCategoryData = selectedCategory
    ? categories.find(c => c.link === selectedCategory)
    : null;

  // 根据搜索关键词过滤工具
  useEffect(() => {
    if (!searchKeyword) {
      setFilteredTools([]);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    const filtered = allTools.filter(tool =>
      tool.name.toLowerCase().includes(keyword) ||
      tool.description.toLowerCase().includes(keyword) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(keyword)))
    );

    setFilteredTools(filtered);

    // 如果有搜索结果，找出涉及的分类
    if (filtered.length > 0) {
      // 获取搜索结果中涉及的所有分类
      const matchedCategories = filtered
        .map(tool => tool.category)
        .filter((category, index, self) => category && self.indexOf(category) === index);

      console.log('Matched categories:', matchedCategories);

      // 搜索时不自动选中任何分类
      setSelectedCategory(null);
    }
  }, [searchKeyword, allTools]);

  // 确定要显示的工具列表
  const displayTools = searchKeyword
    ? filteredTools
    : (selectedCategory ? tools : allTools);

  // 确定当前主题类名
  const themeClass = mounted ? (resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme') : '';

  // 获取搜索结果中涉及的分类
  const matchedCategories = searchKeyword
    ? Array.from(new Set(filteredTools.map(tool => tool.category).filter(Boolean) as string[]))
    : [];

  return (
    <div className={`space-y-2 ${themeClass}`}>
      {/* 分类按钮区域 */}
      <div className={styles.categoryContainer}>
        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            // 判断该分类是否在搜索结果中
            const isInSearchResults = searchKeyword && matchedCategories.includes(category.name);

            return (
              <button
                key={category.link}
                className={`${styles.categoryButton} ${selectedCategory === category.link ? styles.selected : ''} ${isInSearchResults ? styles.matched : ''}`}
                onClick={() => handleCategoryClick(category.link)}
              >
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* 回退按钮 */}
        <button
          className={`${styles.resetButton} ${!selectedCategory && !searchKeyword ? styles.disabled : ''}`}
          onClick={handleResetClick}
          disabled={!selectedCategory && !searchKeyword}
          aria-label={t('reset')}
          type="button"
        >
          <span className={styles.resetIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>

      <div className="mt-2">
        {searchKeyword ? (
          <div className="mb-4 p-3">
            <h2 className="text-2xl font-bold mb-1">
              {t('searchResults')}: &quot;&quot;{searchKeyword}&quot;&quot; ({displayTools.length})
            </h2>
            {matchedCategories.length > 0 && (
              <p className="text-base text-muted-foreground">
                {t('matchedCategories')}: {matchedCategories.join(', ')}
              </p>
            )}
          </div>
        ) : selectedCategory && selectedCategoryData ? (
          <div className="mb-4 p-3">
            <h2 className="text-2xl font-bold mb-1">{selectedCategoryData.name}</h2>
            <p className="text-base text-muted-foreground">{selectedCategoryData.description}</p>
          </div>
        ) : (
          <div className="mb-4 p-3">
            <h2 className="text-2xl font-bold">{t('browseAllTools')}</h2>
          </div>
        )}

        {loading && !searchKeyword ? (
          <div className="text-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2">{t('loading')}</p>
          </div>
        ) : displayTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayTools.map((tool, index) => (
              <JetBrainsToolCard
                key={`${tool.name}-${index}`}
                id={tool.id}
                name={tool.name}
                description={tool.description}
                category={tool.category}
                url={tool.url}
                homeImg={tool.homeImg}
                iconUrl={tool.iconUrl}
                tags={tool.tags}
                submit={tool.submit}
                showPrice={tool.showPrice}
                price={tool.price}
                salePrice={tool.salePrice}
                hot={tool.hot}
                star={tool.star}
                traffic={tool.traffic}
                like={tool.like}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p>{searchKeyword ? t('noSearchResults') : t('comingSoon')}</p>
          </div>
        )}
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className={`${styles.scrollTopButton} bg-primary text-primary-foreground shadow-md hover:bg-primary/90`}
          aria-label={t('goToTop')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 12 12 8 8 12" />
            <line x1="12" y1="16" x2="12" y2="8" />
          </svg>
        </button>
      )}
    </div>
  );
} 