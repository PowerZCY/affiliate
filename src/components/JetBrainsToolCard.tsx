'use client';
import { appConfig } from '@/lib/appConfig';
import { Tool } from '@/lib/data';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState } from 'react';

// 格式化数字显示（K、M单位）
function formatNumber(num: number): string {
  if (num <= 0) return '0';
  if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}M+`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`;
  }
  return num.toString();
}

export type ToolCardProps = Tool;

// TODO
export function JetBrainsToolCard({
  name,
  description,
  category,
  url,
  homeImg,
  tags = [],
  hot,
  submit,
  showPrice,
  price,
  salePrice,
  star,
  traffic,
  like
}: ToolCardProps) {
  // 使用国际化翻译
  const t = useTranslations('toolCard');

  // 添加悬停状态
  const [isHovered, setIsHovered] = useState(false);
  // 添加焦点状态
  const [isFocused, setIsFocused] = useState(false);
  // 添加原始图片错误状态
  const [originalImageError, setOriginalImageError] = useState(false);
  // 添加默认图片错误状态
  const [defaultImageError, setDefaultImageError] = useState(false);
  // 添加标签悬浮状态
  const [isTagsHovered, setIsTagsHovered] = useState(false);
  const { resolvedTheme } = useTheme();

  // 修改标签显示逻辑，将分类标签也加入到显示标签中，并去重
  const allTags = category
    ? Array.from(new Set([category, ...tags])).slice(0, 5)
    : Array.from(new Set(tags)).slice(0, 5);

  // 移除 showAllTags 相关代码，只保留固定显示 2 个标签的逻辑
  const displayTags = allTags.slice(0, 2);

  // 限制 description 的长度，超过 80 个字符则截断并添加省略号
  const maxDescriptionLength = 80;
  const truncatedDescription = description.length > maxDescriptionLength
    ? `${description.substring(0, maxDescriptionLength)}...`
    : description;

  // 根据主题设置边框颜色
  const hoverBorderColor = resolvedTheme === 'dark' ? 'rgba(124, 77, 255, 0.8)' : 'rgba(124, 77, 255, 0.8)';
  const hoverShadow = resolvedTheme === 'dark'
    ? '0 0 0 1px rgba(124, 77, 255, 0.5), 0 4px 12px rgba(124, 77, 255, 0.25)'
    : '0 0 0 1px rgba(124, 77, 255, 0.5), 0 4px 12px rgba(124, 77, 255, 0.25)';

  // 是否显示banner图 - 如果配置开启且有图片，或者配置开启但使用默认图片
  const showBanner = appConfig.ui.showToolBanner;
  const showStatistics = appConfig.ui.showStatistics;

  const defaultImg = appConfig.tool.defaultBanner;
  const bannerImageSrc = homeImg ? `${appConfig.tool.bannerDir}/${homeImg}` : defaultImg;

  // 判断是否使用默认图片
  const isDefaultImage = !homeImg;

  // 根据主题设置banner图的蒙版颜色（仅用于默认图片）
  const overlayColor = resolvedTheme === 'dark'
    ? 'rgba(17, 24, 39, 0.6)' // 深色主题下的蒙版颜色
    : 'rgba(255, 255, 255, 0.6)'; // 浅色主题下的蒙版颜色

  // 实际内容
  return (
    <div className="relative mt-2"> {/* 调整顶部边距 */}
      {/* Hot标签 */}
      {hot && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex justify-center"
          style={{
            transform: 'translateY(-50%)',
          }}
        >
          <div
            className="px-4 py-1 rounded-md text-white font-medium text-xs"
            style={{
              backgroundColor: '#7c4dff',
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
          outline: 'none',
        }}
      >
        {/* Banner图区域 */}
        {showBanner && (
          <div className="relative w-full h-28 rounded-lg overflow-hidden border-2"
            style={{
              borderColor: resolvedTheme === 'dark'
                ? 'rgba(37, 185, 137, 0.3)'
                : 'rgba(37, 185, 137, 0.2)'
            }}>
            {!originalImageError ? (
              <Image
                src={bannerImageSrc}
                alt={`${name} banner`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-300 group-hover:brightness-105"
                style={isDefaultImage ? { opacity: '0.7' } : {}}
                priority={false}
                loading="lazy"
                onError={(e) => {
                  console.error(`Failed to load original image: ${bannerImageSrc}`);
                  setOriginalImageError(true);
                  if (!isDefaultImage) {
                    // 如果不是默认图片，则尝试加载默认图片
                    e.currentTarget.src = defaultImg;
                    e.currentTarget.onerror = (_e2) => {
                      console.error('Failed to load default image');
                      setDefaultImageError(true);
                    };
                  } else {
                    // 如果本身就是默认图片加载失败
                    setDefaultImageError(true);
                  }
                }}
              />
            ) : !defaultImageError ? (
              <Image
                src={defaultImg}
                alt="Default banner"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-300 group-hover:brightness-105"
                style={{ opacity: '0.7' }}
                priority={false}
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load default image');
                  setDefaultImageError(true);
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Failed to load Img</span>
              </div>
            )}
            {/* 只对默认图片添加蒙版层 */}
            {(isDefaultImage || originalImageError) && !defaultImageError && (
              <div
                className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  backgroundColor: overlayColor,
                  backdropFilter: 'blur(1px)',
                  mixBlendMode: resolvedTheme === 'dark' ? 'color-dodge' : 'multiply'
                }}
              />
            )}
          </div>
        )}

        {/* 内容区域 - 包装在链接中 */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col flex-grow cursor-pointer"
        >
          <div className="flex flex-col flex-grow pt-3 pb-2">
            {/* 头部区域到描述区域的代码保持不变 */}
            {/* 头部区域：图标、名称、外部链接 */}
            <div className="flex items-start justify-between mb-1.5 px-3"> {/* 添加水平内边距 */}
              <div className="flex items-center gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold truncate">{name}</h3> {/* 调整标题字体大小 */}
                </div>
              </div>
            </div>

            {/* 标签区域 */}
            <div className="h-auto min-h-[1.5rem] mb-1.5 px-3">
              {allTags.length > 0 && (
                <div className="flex items-center flex-row flex-nowrap gap-1">
                  {displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {allTags.length > 2 && (
                    <div className="relative inline-flex flex-shrink-0">
                      <button
                        onMouseEnter={() => setIsTagsHovered(true)}
                        onMouseLeave={() => setIsTagsHovered(false)}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        +{allTags.length - 2}
                      </button>
                      {isTagsHovered && (
                        <div
                          className="absolute left-0 top-full mt-1 z-50 py-2 min-w-max"
                          onMouseEnter={() => setIsTagsHovered(true)}
                          onMouseLeave={() => setIsTagsHovered(false)}
                        >
                          {allTags.slice(2).map((tag) => (
                            <div
                              key={tag}
                              className="px-3 py-1"
                            >
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                {tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 描述区域 - 调整为3行高度 */}
            <p className="text-xs text-muted-foreground h-12 line-clamp-3 mb-2 px-3">
              {truncatedDescription}
            </p>
          </div>
        </a>
        {/* 数据展示区域 - 第一行 */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-800">
          {/* 提交状态 */}
          <div className="flex items-center gap-1">
            <svg
              className={`w-4 h-4 ${submit ? 'text-purple-500' : 'text-gray-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {submit ? t('canSubmit') : t('noSubmit')}
            </span>
          </div>

          {/* 价格信息部分保持不变 */}
          <div className="flex items-center">
            {showPrice ? (
              <div className="flex items-center gap-1">
                {salePrice !== -1 && (
                  <span className="text-sm font-medium text-purple-500">
                    ${salePrice ? salePrice.toFixed(2) : '0.00'}
                  </span>
                )}
                <span className={`text-sm ${salePrice !== -1 ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  ${price ? price.toFixed(2) : '0.00'}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400"></span>
            )}
          </div>
        </div>

        {/* 数据展示区域 - 第二行 */}
        {showStatistics && (
          <div className="flex items-center justify-between px-3 py-2">
            {/* 流量 */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(traffic)}</span>
            </div>

            {/* 收藏数 */}
            <div className="flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${like > 0 ? 'text-red-500' : 'text-gray-400'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {like > 0 && <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(like)}</span>}
            </div>

            {/* 评分 */}
            <div className="flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${star > 0 ? 'text-yellow-400' : 'text-gray-400'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {star > 0 && <span className="text-sm text-gray-600 dark:text-gray-400">{star.toFixed(1)}</span>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}