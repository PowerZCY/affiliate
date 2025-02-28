'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/[locale]/category/CategoryPage.module.css';
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';

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
  
  useEffect(() => {
    async function fetchTools() {
      if (selectedCategory) {
        setLoading(true);
        try {
          // 找到选中分类的src
          const category = categories.find(c => c.link === selectedCategory);
          if (category && category.src) {
            // 获取该分类下的工具
            const response = await fetch(`/api/tools?category=${category.src}`);
            const data = await response.json();
            setTools(data.tools || []);
          } else {
            setTools([]);
          }
        } catch (error) {
          console.error('获取工具列表失败:', error);
          setTools([]);
        } finally {
          setLoading(false);
        }
      } else {
        setTools([]);
      }
    }
    
    fetchTools();
  }, [selectedCategory, categories]);
  
  const handleCategoryClick = (categoryLink: string) => {
    if (selectedCategory === categoryLink) {
      // 如果点击的是已选中的分类，则清除选择
      setSelectedCategory(null);
    } else {
      // 否则设置为新选中的分类
      setSelectedCategory(categoryLink);
    }
  };
  
  const handleResetClick = () => {
    setSelectedCategory(null);
  };
  
  // 获取当前选中的分类信息
  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.link === selectedCategory) 
    : null;
  
  return (
    <div className="space-y-8">
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <button
            key={category.link}
            className={`${styles.categoryButton} ${selectedCategory === category.link ? styles.selected : ''}`}
            onClick={() => handleCategoryClick(category.link)}
          >
            {category.name}
          </button>
        ))}
        <button 
          className={`${styles.resetButton} ${!selectedCategory ? styles.disabled : ''}`}
          onClick={handleResetClick}
          disabled={!selectedCategory}
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
              <p className="mt-4">加载中...</p>
            </div>
          ) : tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <JetBrainsToolCard
                  key={tool.name}
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
              <p>该分类下暂无工具</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 