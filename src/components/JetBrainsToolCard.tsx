import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import styles from './JetBrainsToolCard.module.css';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  tags?: string[];
  icon_url?: string;
  category?: string;
  hot?: string;
}

export function JetBrainsToolCard({ 
  name, 
  description, 
  url, 
  tags = [], 
  icon_url,
  category,
  hot 
}: ToolCardProps) {
  // 使用国际化翻译
  const t = useTranslations('toolCard');
  
  // 添加悬停状态
  const [isHovered, setIsHovered] = useState(false);
  // 添加焦点状态
  const [isFocused, setIsFocused] = useState(false);
  // 获取当前主题
  const { resolvedTheme } = useTheme();
  
  // 限制 tags 只显示前 3 个
  const displayTags = tags.slice(0, 3);
  
  // 限制 description 的长度，超过 80 个字符则截断并添加省略号
  const maxDescriptionLength = 80;
  const truncatedDescription = description.length > maxDescriptionLength 
    ? `${description.substring(0, maxDescriptionLength)}...` 
    : description;
  
  // 根据主题设置边框颜色
  const hoverBorderColor = resolvedTheme === 'dark' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(14, 165, 233, 0.8)';
  const hoverShadow = resolvedTheme === 'dark' 
    ? '0 0 0 1px rgba(56, 189, 248, 0.5), 0 4px 12px rgba(56, 189, 248, 0.25)' 
    : '0 0 0 1px rgba(14, 165, 233, 0.5), 0 4px 12px rgba(14, 165, 233, 0.25)';
  
  // 实际内容
  return (
    <div 
      className="jetbrains-card group border rounded-lg shadow-sm p-4 h-[220px] flex flex-col transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      style={{
        borderColor: (isHovered || isFocused) ? hoverBorderColor : '',
        borderWidth: (isHovered || isFocused) ? '2px' : '1px',
        boxShadow: (isHovered || isFocused) ? hoverShadow : '',
        padding: (isHovered || isFocused) ? '15px' : '16px', // 保持内容区域大小一致
        transform: (isHovered || isFocused) ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        outline: 'none', // 移除默认的焦点轮廓
      }}
    >
      {/* 头部区域：图标、名称、外部链接 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon_url ? (
            <div className="h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
              <Image
                src={icon_url}
                alt={name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
              {name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{name}</h3>
          </div>
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">{t('visit')} {name}</span>
        </Link>
      </div>
      
      {/* 标签区域：固定高度 */}
      <div className="h-8 mb-2">
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-secondary/70 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                +{tags.length - 3}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {category}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* 描述区域：固定高度，最多2行 */}
      <p className="text-sm text-muted-foreground h-10 line-clamp-2 mb-auto">{truncatedDescription}</p>
      
      {/* 按钮区域：固定在底部 */}
      <div className="mt-auto pt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#1677ff',
            color: 'white',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none'
          }}
        >
          {t('visitWebsite')}
        </a>
      </div>
    </div>
  );
} 