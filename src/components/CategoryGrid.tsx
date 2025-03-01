'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from '@/app/[locale]/category/CategoryPage.module.css';
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';
import { useTheme } from 'next-themes'; // 如果您使用 next-themes 管理主题

type CategoryType = {
  name: string;
  link: string;
  description: string;
  src?: string;
};

type ToolType = {
  name: string;
  description: string;
  url: string;
  tags?: string[];
  icon_url?: string;
  category?: string; // 添加分类标识
};

// 缓存对象，用于存储已获取的工具数据
const toolsCache: Record<string, ToolType[]> = {};

export function CategoryGrid({ categories }: { 
  categories: CategoryType[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<ToolType[]>([]);
  const [allTools, setAllTools] = useState<ToolType[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 初始加载状态设为true
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const { theme } = useTheme(); // 获取当前主题
  const isMounted = useRef(true);
  
  // 监听滚动事件，控制回到顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // 组件卸载时设置标志
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // 获取单个分类的工具数据（优先使用缓存）
  const fetchToolsData = useCallback(async (src: string, categoryName: string) => {
    console.log(`Fetching tools for src: ${src}`);
    setLoading(true);
    
    try {
      // 检查缓存中是否已有该分类的数据
      if (toolsCache[src]) {
        console.log(`Using cached data for ${src}`);
        setTools(toolsCache[src]);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/tools?category=${src}`);
      const data = await response.json();
      
      if (data.tools && Array.isArray(data.tools)) {
        // 为工具添加分类标识
        const toolsWithCategory = data.tools.map((tool: ToolType) => ({
          ...tool,
          category: categoryName
        }));
        
        // 更新缓存
        toolsCache[src] = toolsWithCategory;
        setTools(toolsWithCategory);
      } else {
        console.warn(`No tools found for src ${src}`);
        setTools([]);
      }
    } catch (error) {
      console.error(`Failed to fetch tools for src ${src}:`, error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // 获取所有分类的工具数据（优先使用缓存）
  const fetchAllTools = useCallback(async () => {
    console.log('Fetching all tools');
    setLoading(true);
    
    try {
      // 获取所有有src属性的分类
      const categoriesWithSrc = categories.filter(c => c.src);
      
      if (categoriesWithSrc.length === 0) {
        console.warn('No categories with src property found');
        setAllTools([]);
        setLoading(false);
        return;
      }
      
      // 检查是否所有分类都已缓存
      const allCached = categoriesWithSrc.every(category => 
        category.src && toolsCache[category.src]
      );
      
      if (allCached) {
        console.log('Using cached data for all categories');
        // 合并所有缓存的工具数据
        const allCachedTools = categoriesWithSrc.flatMap(category => 
          category.src ? toolsCache[category.src] : []
        );
        
        // 去除重复项
        const uniqueTools = allCachedTools.filter((tool, index, self) => 
          index === self.findIndex(t => t.name === tool.name)
        );
        
        setAllTools(uniqueTools);
        setLoading(false);
        return;
      }
      
      // 并行获取所有分类的工具
      const promises = categoriesWithSrc.map(async (category) => {
        if (category.src) {
          // 检查缓存
          if (toolsCache[category.src]) {
            return toolsCache[category.src];
          }
          
          try {
            const response = await fetch(`/api/tools?category=${category.src}`);
            const data = await response.json();
            
            if (data.tools && Array.isArray(data.tools)) {
              // 为工具添加分类标识
              const toolsWithCategory = data.tools.map((tool: ToolType) => ({
                ...tool,
                category: category.name
              }));
              
              // 更新缓存
              toolsCache[category.src] = toolsWithCategory;
              return toolsWithCategory;
            }
          } catch (error) {
            console.error(`Failed to fetch tools for ${category.src}:`, error);
          }
        }
        return [];
      });
      
      const results = await Promise.all(promises);
      
      // 合并所有工具，并去除重复项
      const allToolsData = results.flat();
      const uniqueTools = allToolsData.filter((tool, index, self) => 
        index === self.findIndex(t => t.name === tool.name)
      );
      
      console.log(`Fetched ${uniqueTools.length} tools from all categories`);
      setAllTools(uniqueTools);
    } catch (error) {
      console.error('Failed to fetch all tools:', error);
      setAllTools([]);
    } finally {
      setLoading(false);
    }
  }, [categories]);
  
  // 组件加载时获取所有工具
  useEffect(() => {
    fetchAllTools();
  }, [fetchAllTools]);
  
  // 处理分类点击
  const handleCategoryClick = useCallback((categoryLink: string) => {
    console.log(`Clicking category: ${categoryLink}`);
    
    // 找到对应的分类对象
    const category = categories.find(c => c.link === categoryLink);
    
    if (!category) {
      console.error(`Category not found: ${categoryLink}`);
      return;
    }
    
    if (selectedCategory === categoryLink) {
      // 如果点击的是已选中的分类，则取消选择并显示所有工具
      setSelectedCategory(null);
    } else {
      // 选择新分类并获取数据
      setSelectedCategory(categoryLink);
      
      // 使用src属性获取工具数据
      if (category.src) {
        console.log(`Using category.src: ${category.src}`);
        fetchToolsData(category.src, category.name);
      } else {
        console.warn(`Category ${categoryLink} has no src property`);
        setTools([]);
      }
    }
  }, [selectedCategory, fetchToolsData, categories]);
  
  // 处理重置按钮点击
  const handleResetClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCategory(null);
  }, []);
  
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
  
  // 确定要显示的工具列表
  const displayTools = selectedCategory ? tools : allTools;
  
  return (
    <div className={`space-y-8 ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <div className={styles.categoryContainer}>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={category.link}
              className={`${styles.categoryButton} ${selectedCategory === category.link ? styles.selected : ''}`}
              onClick={() => handleCategoryClick(category.link)}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* 回退按钮 - JetBrains风格 */}
        <button 
          className={`${styles.resetButton} ${!selectedCategory ? styles.disabled : ''}`}
          onClick={handleResetClick}
          disabled={!selectedCategory}
          aria-label="Reset"
          type="button"
        >
          <span className={styles.resetIcon}>↩</span>
        </button>
      </div>
      
      <div className="mt-12">
        {selectedCategory && selectedCategoryData ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{selectedCategoryData.name}</h2>
            <p className="text-lg text-muted-foreground">{selectedCategoryData.description}</p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">所有工具</h2>
            <p className="text-lg text-muted-foreground">浏览我们提供的所有开发工具</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4">loading...</p>
          </div>
        ) : displayTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTools.map((tool, index) => (
              <JetBrainsToolCard
                key={`${tool.name}-${index}`}
                name={tool.name}
                description={tool.description}
                url={tool.url}
                tags={tool.tags}
                icon_url={tool.icon_url}
                category={tool.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p>coming soon...</p>
          </div>
        )}
      </div>
      
      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className={styles.scrollTopButton}
          aria-label="Go to top"
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