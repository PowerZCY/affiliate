'use client';

import { Badge } from '@/components/ui/badge';
import type { BlogPost, BlogData } from '@/types/blog-data';
import blogData from '@/../../public/md/blog-config.json';
import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

const typedBlogData = blogData as BlogData;

interface BlogHeaderProps {
  slug: string;
  locale: string;
}

export function BlogHeader({ slug, locale }: BlogHeaderProps) {
  const t = useTranslations('blog');

  // 直接使用生成的静态数据
  const [posts] = useState<BlogPost[]>(typedBlogData[locale].posts);
  // 找到当前文章
  const post = posts.find(post => post.slug === slug);
  // 如果文章不存在，返回空
  if (!post) {
    return null;
  }
  return (
    <div className="relative">
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false} // 移除优先加载，除非这是首屏关键图片
          loading="eager" // 使用eager替代priority，更适合首屏但不那么激进
        />
      </div>

      {/* 信息展示区域 - 移到banner下方 */}
      <div className="relative bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm border-b">
        {/* 炫彩背景效果 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_-30%_50%,rgba(123,31,162,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_130%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-blue-500/5 animate-gradient-x" />
        </div>

        {/* 内容区域 */}
        <div className="container mx-auto px-8 py-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((id: string) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs font-normal bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600 transition-all duration-300 cursor-pointer"
                  >
                    {t(`tags.${id}`)}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold tracking-tight font-jetbrains">
                {post.title}
              </h1>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                    priority={false} // 移除优先加载
                    loading="lazy" // 使用懒加载，因为头像通常不是关键渲染内容
                  />
                </div>
                <span className="font-medium">{post.author.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 装饰效果 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,var(--primary)/3_12%,transparent_30%,transparent_70%,var(--primary)/3_88%)] bg-[length:24px_24px]" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-border to-transparent opacity-20" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent opacity-20" />
        </div>
      </div>
    </div>
  );
}