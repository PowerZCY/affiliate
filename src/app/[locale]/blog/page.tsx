/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import blogData from '@/../../public/md/blog-config.json';
import { Badge } from '@/components/ui/badge';
import { appConfig } from '@/lib/appConfig';
import styles from '@/styles/CategoryPage.module.css';
import type { BlogData, BlogPost } from '@/types/blog-data';
import Fuse from 'fuse.js';
import { Clock, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const typedBlogData = blogData as BlogData;

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('blog');
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag') || 'all';

  // 从配置中获取每页显示数量，默认为6
  const postsPerPage = appConfig.blog.pageConfig.size || 6;

  const [posts] = useState<BlogPost[]>(typedBlogData[locale].posts);
  const [tags] = useState<string[]>(typedBlogData[locale].tags);
  const [selectedTag, setSelectedTag] = useState<string>(tagParam);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 回到顶部按钮相关状态
  const [showGoToTop, setShowGoToTop] = useState<boolean>(false);

  // 配置 Fuse.js 搜索选项
  // 将 fuseOptions 移入 useMemo
  const fuse = useMemo(() => {
    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,
      keys: [
        {
          name: 'title',
          weight: 0.4
        },
        {
          name: 'excerpt',
          weight: 0.3
        },
        {
          name: 'tags',
          weight: 0.2
        },
        {
          name: 'author.name',
          weight: 0.1
        }
      ],
      useExtendedSearch: true,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true,
    };

    return new Fuse(posts, fuseOptions);
  }, [posts]); // 现在只依赖于 posts

  // 修改标签点击处理函数
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSearchQuery(''); // 清空搜索框
    setActiveSearchQuery(''); // 清空实际搜索关键词
    setSearchResults([]); // 清空搜索结果
    setCurrentPage(1); // 重置分页
  };

  // 修改搜索框键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 执行搜索前，清除选中的分类标签（设为空字符串表示未选中）
      setSelectedTag('');
      setActiveSearchQuery(searchQuery);
      handleSearch(searchQuery);
      setCurrentPage(1); // 重置分页
    }
  };

  // 修改搜索处理函数
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // 执行搜索
    const results = fuse.search(query);

    if (results.length === 0) {
      setSearchResults([]);
      return;
    }

    const processedResults = results
      .map(result => ({
        ...result.item,
        score: result.score || 1
      }))
      .sort((a, b) => {
        const getRelevanceScore = (item: {
          score: number;
          title: string;
          featured: boolean;
          publishedAt: string;
        }) => {
          let relevanceScore = item.score;

          if (item.title.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore *= 0.8;
          }

          const daysAgo = (new Date().getTime() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
          relevanceScore *= (1 + Math.exp(-daysAgo / 365));

          return relevanceScore;
        };

        return getRelevanceScore(a) - getRelevanceScore(b);
      })
      .map(({ score: _score, ...post }) => post as BlogPost);

    setSearchResults(processedResults);
  };

  // 修改特色文章的获取逻辑
  const featuredPost = useMemo(() => {
    // 搜索模式
    if (activeSearchQuery) {
      return searchResults.length > 0
        ? searchResults.find(post => post.featured) || null
        : null;
    }

    // 标签筛选模式
    return selectedTag === 'all'
      ? posts.find(post => post.featured) || null
      : posts.filter(post => post.tags.includes(selectedTag))
        .find(post => post.featured) || null;
  }, [searchResults, selectedTag, posts, activeSearchQuery]);

  // 修改文章过滤逻辑
  const filteredPosts = useMemo(() => {
    // 搜索模式
    if (activeSearchQuery) {
      return searchResults;
    }

    // 标签筛选模式
    return selectedTag === 'all'
      ? posts
      : posts.filter(post => post.tags.includes(selectedTag));
  }, [selectedTag, searchResults, posts, activeSearchQuery]);

  // 计算分页后的文章列表
  const paginatedPosts = useMemo(() => {
    // 如果有特色文章，从列表中排除
    const postsWithoutFeatured = featuredPost
      ? filteredPosts.filter(post => post.id !== featuredPost.id)
      : filteredPosts;

    // 返回当前页应显示的所有文章（累积显示）
    return postsWithoutFeatured.slice(0, currentPage * postsPerPage);
  }, [filteredPosts, featuredPost, currentPage, postsPerPage]);

  // 计算是否还有更多页
  const hasMorePages = useMemo(() => {
    const postsWithoutFeatured = featuredPost
      ? filteredPosts.filter(post => post.id !== featuredPost.id)
      : filteredPosts;

    return currentPage * postsPerPage < postsWithoutFeatured.length;
  }, [filteredPosts, featuredPost, currentPage, postsPerPage]);

  // 计算总页数
  const totalPages = useMemo(() => {
    const postsWithoutFeatured = featuredPost
      ? filteredPosts.filter(post => post.id !== featuredPost.id)
      : filteredPosts;

    return Math.ceil(postsWithoutFeatured.length / postsPerPage);
  }, [filteredPosts, featuredPost, postsPerPage]);

  // 加载更多处理函数
  const handleLoadMore = () => {
    if (hasMorePages) {
      setIsLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  };

  // 回到顶部处理函数
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 获取最近的文章
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // 当URL参数变化时更新选中的标签
  useEffect(() => {
    setSelectedTag(tagParam);
  }, [tagParam]);

  // 监听滚动事件，控制回到顶部按钮的显示
  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过500px时显示回到顶部按钮
      setShowGoToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 添加回退按钮点击处理函数
  const handleResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag('all');
    setSearchQuery(''); // 清空搜索框
    setActiveSearchQuery(''); // 清空实际搜索关键词
    setSearchResults([]); // 清空搜索结果
    setCurrentPage(1); // 重置分页
  };

  return (
    <div className="container mx-auto py-12">
      {/* 页面标题 */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('hero.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('hero.subtitle')}</p>
      </div>

      {/* 搜索和标签筛选 - 放在顶部，宽度占满 */}
      <div className="mb-12 space-y-6">
        {/* 修改搜索框，只在回车时触发搜索 */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* 修改标签按钮区域，参考 CategoryGrid.tsx 的设计 */}
        <div className={`${styles.categoryContainer} flex justify-center items-center flex-wrap gap-2`}>
          <div className={`${styles.categoryGrid} flex flex-wrap justify-center gap-2`}>
            <button
              className={`${styles.categoryButton} ${selectedTag === 'all' ? styles.selected : ''}`}
              onClick={() => handleTagClick('all')}
            >
              <span>{t('allPosts')}</span>
            </button>
            {tags.map((id: string) => {
              // 如果有搜索结果，根据搜索结果中是否包含该标签来决定是否点亮
              const isInSearchResults = searchResults.length > 0 && searchResults.some(post => post.tags.includes(id));

              return (
                <button
                  key={id}
                  className={`${styles.categoryButton} ${selectedTag === id ? styles.selected : ''} ${isInSearchResults ? styles.matched : ''}`}
                  onClick={() => handleTagClick(id)}
                >
                  <span>{t(`tags.${id}`)}</span>
                </button>
              );
            })}
          </div>

          {/* 添加回退按钮 - 调整为紧挨着最后一个标签 */}
          <button
            className={`${styles.resetButton} ml-1 ${selectedTag === 'all' && !activeSearchQuery ? styles.disabled : ''}`}
            onClick={handleResetClick}
            disabled={selectedTag === 'all' && !activeSearchQuery}
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
      </div>

      {/* 特色文章部分 - 修改显示条件 */}
      {featuredPost && (
        <Link
          href={`/${locale}/blog/${featuredPost.slug}`}
          className="block mb-12 group"
          prefetch={false}
        >
          <div className="relative rounded-xl overflow-hidden">
            <div className="relative aspect-[21/9]">
              <Image
                src="/images/default.webp"
                alt={featuredPost.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
              <div className="flex gap-2 mb-2">
                {featuredPost.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300"
                  >
                    {t(`tags.${tag}`)}
                  </Badge>
                ))}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 max-w-3xl">{featuredPost.title}</h2>
              <p className="text-white/80 mb-4 max-w-2xl md:text-lg">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      priority={false}
                      loading="lazy"
                    />
                  </div>
                  <span>{featuredPost.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPost.readTime} {t('readTime')}</span>
                </div>
                <div>{featuredPost.publishedAt}</div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* 文章列表部分 - 修改显示条件 */}
      {filteredPosts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post: BlogPost) => (
                <div key={post.id} className="group relative bg-card rounded-lg overflow-hidden border-2 border-transparent hover:border-[#8B5CF6] shadow-sm hover:shadow-purple-500/50 transition-all duration-200 before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-purple-500 before:via-purple-600 before:to-indigo-700 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:-z-10">
                  {/* Banner图区域移到外部 */}
                  <div className="relative aspect-[1.91/1]">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                  </div>

                  {/* 修改标签显示部分 - 显示所有标签 */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {post.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300"
                        >
                          {t(`tags.${tag}`)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="flex flex-col"
                    prefetch={false}
                  >
                    {/* 内容区域 */}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-base font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        <span className={`${post.title.length > 30 ? 'cursor-help' : ''}`} title={post.title.length > 30 ? post.title : undefined}>
                          {post.title}
                        </span>
                      </h3>

                      {/* 描述区域 - 固定高度三行 */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 min-h-[4rem]">
                        <span className={`${post.excerpt.length > 150 ? 'cursor-help' : ''}`} title={post.excerpt.length > 150 ? post.excerpt : undefined}>
                          {post.excerpt}
                        </span>
                      </p>

                      {/* 底部信息区域保持不变 */}
                      <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              fill
                              sizes="24px"
                              className="object-cover"
                              priority={false}
                              loading="lazy"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground truncate" title={post.author.name}>
                            {post.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* 修改LoadMore按钮，添加加载进度显示 */}
            {hasMorePages && (
              <div className="mt-8 flex justify-center">
                <button
                  className={`${styles.categoryButton} px-8 relative min-w-[160px] ${isLoading ? 'opacity-80' : ''}`}
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      {t('loading')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t('loadMore')}
                      <span className="text-xs text-white/80">
                        ({currentPage}/{totalPages})
                      </span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 侧边栏 - 最近文章列表始终显示 */}
          <div className="lg:w-1/4 space-y-8">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-medium mb-4 text-lg border-b pb-2">{t('recentPosts')}</h3>
              <div className="space-y-4">
                {recentPosts.map((post: BlogPost) => (
                  <Link
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    className="flex gap-3 group"
                    prefetch={false}
                  >
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        priority={false}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2 text-sm">{post.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{post.publishedAt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 无搜索结果提示 - 使用 activeSearchQuery */}
      {activeSearchQuery && searchResults.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">{t('noResults')}</p>
        </div>
      )}

      {/* 回到顶部按钮 */}
      {showGoToTop && (
        <button
          onClick={handleGoToTop}
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