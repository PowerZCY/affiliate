import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import styles from './JetBrainsToolCard.module.css';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { appConfig } from '@/lib/appConfig';

export interface ToolCardProps {
  name: string;
  description: string;
  url: string;
  tags?: string[];
  icon_url?: string;
  category?: string;
  hot?: string;
  home_img?: string;
}

export function JetBrainsToolCard({ 
  name, 
  description, 
  url, 
  tags = [], 
  icon_url,
  category,
  hot,
  home_img
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
  
  // 是否显示banner图 - 如果配置开启且有图片，或者配置开启但使用默认图片
  const showBanner = appConfig.ui.showToolBanner;
  const bannerImageSrc = home_img ? `/img/${home_img}` : '/img/default.png';
  
  // 判断是否使用默认图片
  const isDefaultImage = !home_img;
  
  // 根据主题设置banner图的蒙版颜色（仅用于默认图片）
  const overlayColor = resolvedTheme === 'dark' 
    ? 'rgba(17, 24, 39, 0.6)' // 深色主题下的蒙版颜色
    : 'rgba(255, 255, 255, 0.6)'; // 浅色主题下的蒙版颜色
  
  // 实际内容
  return (
    <div className="relative mt-3">
      {/* Hot标签 - 位于卡片顶部边缘 */}
      {hot && (
        <div 
          className="absolute top-0 left-0 right-0 z-20 flex justify-center"
          style={{
            transform: 'translateY(-50%)',
          }}
        >
          <div 
            className="px-6 py-1.5 rounded-md text-white font-medium text-sm"
            style={{
              backgroundColor: '#7c4dff', // 紫色背景
              boxShadow: '0 2px 6px rgba(124, 77, 255, 0.4)',
            }}
          >
            {hot}
          </div>
        </div>
      )}
      
      <div 
        className="jetbrains-card group border rounded-lg shadow-sm overflow-hidden flex flex-col transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        style={{
          borderColor: (isHovered || isFocused) ? hoverBorderColor : '',
          borderWidth: (isHovered || isFocused) ? '2px' : '1px',
          boxShadow: (isHovered || isFocused) ? hoverShadow : '',
          transform: (isHovered || isFocused) ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
          outline: 'none', // 移除默认的焦点轮廓
        }}
      >
        {/* 卡片内容 */}
        <div className="flex flex-col h-full">
          {/* Banner图 - 根据配置显示 */}
          {showBanner && (
            <div className="relative w-full h-40">
              <Image
                src={bannerImageSrc}
                alt={`${name} banner`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                style={isDefaultImage ? { opacity: '0.7' } : {}} // 只对默认图片降低不透明度
                priority
                onError={(e) => {
                  console.error(`Failed to load image: ${bannerImageSrc}`);
                  // 加载失败时使用备用默认图片
                  e.currentTarget.src = '/img/default.png';
                }}
              />
              {/* 只对默认图片添加蒙版层 */}
              {isDefaultImage && (
                <div 
                  className="absolute inset-0 z-10"
                  style={{ 
                    backgroundColor: overlayColor,
                    backdropFilter: 'blur(1px)',
                    mixBlendMode: resolvedTheme === 'dark' ? 'color-dodge' : 'multiply'
                  }}
                />
              )}
            </div>
          )}
          
          {/* 内容区域 */}
          <div className="p-4 flex flex-col flex-grow">
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
                      className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      +{tags.length - 3}
                    </span>
                  )}
                  {category && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
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
        </div>
      </div>
    </div>
  );
} 