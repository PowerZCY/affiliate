/**
 * @license
 * MIT License
 * Copyright (c) 2025 D8ger
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import blogData from '@/../../public/md/blog-config.json';
import type { BlogPost, BlogData } from '@/types/blog-data';
import { appConfig } from '@/lib/appConfig';

const typedBlogData = blogData as BlogData;

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('blog');
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag') || 'all';

  // 直接使用生成的静态数据
  const [posts] = useState<BlogPost[]>(typedBlogData[locale].posts);
  const [tags] = useState<string[]>(typedBlogData[locale].tags);
  const [selectedTag, setSelectedTag] = useState<string>(tagParam);

  // 根据选中的标签过滤文章
  const filteredPosts = selectedTag === 'all'
    ? posts
    : posts.filter(post => post.tags.includes(selectedTag));

  // 获取特色文章，并确保它存在
  const featuredPost = posts.find(post => post.featured) || posts[0];

  // 获取最近的文章
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // 当URL参数变化时更新选中的标签
  useEffect(() => {
    setSelectedTag(tagParam);
  }, [tagParam]);

  return (
    <div className="container mx-auto py-12">
      {/* 页面标题 */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('hero.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('hero.subtitle')}</p>
      </div>

      {/* 搜索和标签筛选 - 放在顶部，宽度占满 */}
      <div className="mb-12 space-y-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border rounded-md"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Button
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag('all')}
            className="px-4 py-2 text-sm"
          >
            {t('allPosts')}
          </Button>
          {tags.map((id: string) => (
            <Button
              key={id}
              variant={selectedTag === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(id)}
              className="px-4 py-2 text-sm"
            >
              {t(`tags.${id}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* 特色文章 - 全宽展示 */}
      {featuredPost && (
        <Link
          href={`/blog/${featuredPost.slug}`}
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
                priority
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
                      priority
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

      <div className="flex flex-col lg:flex-row gap-12">
        {/* 文章列表 - 自适应布局 */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: BlogPost) => (
              <div key={post.id} className="group relative bg-card rounded-lg overflow-hidden border-2 border-transparent hover:border-[#8B5CF6] shadow-sm hover:shadow-purple-500/50 transition-all duration-200 before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-br before:from-purple-500 before:via-purple-600 before:to-indigo-700 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 before:-z-10">
                {/* Banner图区域移到外部 */}
                <div className="relative aspect-[1.91/1]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                </div>

                {/* 标签区域 */}
                <div className="p-4 pb-0">
                  <div className="flex items-center gap-1.5 mb-3 h-6 overflow-visible relative">
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        {post.tags.slice(0, appConfig.blog.getTagDisplayCount(locale)).map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300"
                          >
                            {t(`tags.${tag}`)}
                          </Badge>
                        ))}
                        {post.tags.length > appConfig.blog.getTagDisplayCount(locale) && (
                          <div className="relative group/tags">
                            <Badge
                              variant="secondary"
                              className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                            >
                              +{post.tags.length - appConfig.blog.getTagDisplayCount(locale)}
                            </Badge>
                            {/* 悬浮显示剩余标签 */}
                            <div className="hidden group-hover/tags:block absolute top-full left-0 mt-1 p-2 bg-popover rounded-md shadow-md z-50">
                              <div className="flex flex-col items-start gap-1.5">
                                {post.tags.slice(appConfig.blog.getTagDisplayCount(locale)).map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300 whitespace-nowrap"
                                  >
                                    {t(`tags.${tag}`)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
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
                            priority
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

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="px-8">
              {t('loadMore')}
            </Button>
          </div>
        </div>

        {/* 侧边栏 - 最近文章和热门标签 */}
        <div className="lg:w-1/4 space-y-8">
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-medium mb-4 text-lg border-b pb-2">{t('recentPosts')}</h3>
            <div className="space-y-4">
              {recentPosts.map((post: BlogPost) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex gap-3 group"
                  prefetch={false}  // 这里也添加
                >
                  <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority
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
    </div>
  );
}