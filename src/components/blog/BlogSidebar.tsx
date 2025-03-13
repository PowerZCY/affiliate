'use client';

import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/blog/card';
import { TableOfContents } from '@/components/MarkdownRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlogSidebarProps {
  toc: TableOfContents[];
}

export function BlogSidebar({ toc }: BlogSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      // 设置当前活动项
      setActiveId(id);

      // 获取header高度（如果有的话）
      const headerOffset = 100; // 根据实际header高度调整
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // 平滑滚动
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // 添加高亮效果
      element.classList.add('bg-purple-100/10');
      setTimeout(() => {
        element.classList.remove('bg-purple-100/10');
      }, 1500);
    } else {
      console.warn(`Element with id "${id}" not found in the document`);
    }
  };

  // 监听滚动事件，更新当前活动项
  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map(heading => {
        return document.getElementById(heading.id);
      });
      const scrollPosition = window.scrollY;

      // 找到当前可见的标题
      const currentHeading = headings.find((heading, index) => {
        if (!heading) return false;
        const nextHeading = headings[index + 1];
        const headingTop = heading.offsetTop - 120; // 考虑header高度

        if (!nextHeading) {
          return scrollPosition >= headingTop;
        }

        return scrollPosition >= headingTop &&
          scrollPosition < (nextHeading.offsetTop - 120);
      });

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  return (
    <>
      {/* 悬浮球 - JetBrains风格渐变 */}
      <div
        className="fixed right-4 top-[calc(100px)] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg
          bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700
          hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600
          transition-all duration-300 backdrop-blur-sm"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="text-white/90 hover:text-white text-lg font-medium">目录</span>
      </div>

      {/* 目录内容 - 炫彩渐变效果 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-4 top-[calc(100px)] w-64"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Card className="overflow-hidden backdrop-blur-sm">
              {/* 渐变背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/95 via-purple-600/95 to-indigo-700/95" />

              {/* 光效装饰 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

              {/* 内容区域 */}
              <div className="relative z-10 p-6">
                <h3 className="font-jetbrains font-semibold mb-4 text-lg text-white/90">目录</h3>
                <nav className="space-y-2 text-sm max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {toc.map((heading) => (
                    <div
                      key={heading.id}
                      className={cn(
                        "text-white/80 hover:text-white/100 transition-colors cursor-pointer",
                        {
                          "pl-4": heading.level === 2,
                          "pl-8": heading.level === 3,
                          "!text-white font-medium": activeId === heading.id
                        }
                      )}
                      onClick={() => scrollToHeading(heading.id)}
                    >
                      <span className={cn(
                        "block py-1 rounded transition-all duration-200",
                        "hover:bg-white/10",
                        activeId === heading.id && "bg-white/20"
                      )}>
                        {heading.text}
                      </span>
                    </div>
                  ))}
                </nav>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 添加自定义滚动条样式 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
} 