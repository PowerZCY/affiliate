'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
};

export function CategoryGrid({ categories }: { 
  categories: CategoryType[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<ToolType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme(); // 获取当前主题
  const isMounted = useRef(true);
  
  // 组件卸载时设置标志
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // 获取工具数据的函数 - 直接使用src属性
  const fetchToolsData = useCallback(async (src: string) => {
    console.log(`Fetching tools for src: ${src}`);
    setLoading(true);
    
    try {
      // 直接使用传入的src参数
      const response = await fetch(`/api/tools?category=${src}`);
      const data = await response.json();
      // console.log(`API response for src ${src}: `, data);
      
      if (data.tools && Array.isArray(data.tools)) {
        setTools(data.tools);
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
      // 如果点击的是已选中的分类，则取消选择
      setSelectedCategory(null);
      setTools([]);
    } else {
      // 选择新分类并获取数据
      setSelectedCategory(categoryLink);
      
      // 使用src属性获取工具数据
      if (category.src) {
        console.log(`Using category.src: ${category.src}`);
        fetchToolsData(category.src);
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
    setTools([]);
  }, []);
  
  // 获取当前选中的分类信息
  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.link === selectedCategory) 
    : null;
  
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
      
      {selectedCategory && selectedCategoryData && (
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{selectedCategoryData.name}</h2>
            <p className="text-lg text-muted-foreground">{selectedCategoryData.description}</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4">loading...</p>
            </div>
          ) : tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <JetBrainsToolCard
                  key={`${tool.name}-${index}`}
                  name={tool.name}
                  description={tool.description}
                  url={tool.url}
                  tags={tool.tags}
                  icon_url={tool.icon_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>coming soon...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 