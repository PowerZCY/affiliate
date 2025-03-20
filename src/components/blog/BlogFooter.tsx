'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/blog/separator';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import blogData from '@/../../public/md/blog-config.json';
import { appConfig } from '@/lib/appConfig';

interface BlogFooterProps {
  slug: string;
  locale: (typeof appConfig.i18n.locales)[number];
}

export function BlogFooter({ slug, locale }: BlogFooterProps) {
  const router = useRouter();
  const t = useTranslations('blog');

  // Get current post with proper type checking
  const currentPost = blogData[locale]?.posts.find(post => post.slug === slug);

  // Get prev and next posts
  const prevPost = currentPost?.preSlug
    ? blogData[locale]?.posts.find(post => post.slug === currentPost.preSlug)
    : null;
  const nextPost = currentPost?.nextSlug
    ? blogData[locale]?.posts.find(post => post.slug === currentPost.nextSlug)
    : null;

  // 处理导航
  const handleNavigation = (targetSlug: string) => {
    router.push(`/${locale}/blog/${encodeURIComponent(targetSlug)}`);
  };

  return (
    <div className="border-t border-border/50 mt-8">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div className="w-1/3" />


          {/* 中间的分享按钮
          <div className="w-1/3 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-muted/80"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-muted/80"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div> 
          */}

          {/* 右侧的导航按钮 */}
          <div className="w-1/3 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-white/90 hover:text-white
                bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700
                hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600
                transition-all duration-300 backdrop-blur-sm shadow-lg
                disabled:from-purple-500/50 disabled:via-purple-600/50 disabled:to-indigo-700/50
                disabled:text-white/50"
              onClick={() => prevPost && handleNavigation(prevPost.slug)}
              disabled={!prevPost}
              title={prevPost?.title}
            >
              <ChevronLeft className="h-4 w-4" />
              {t('prevPost')}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-white/90 hover:text-white
                bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700
                hover:from-purple-400 hover:via-purple-500 hover:to-indigo-600
                transition-all duration-300 backdrop-blur-sm shadow-lg
                disabled:from-purple-500/50 disabled:via-purple-600/50 disabled:to-indigo-700/50
                disabled:text-white/50"
              onClick={() => nextPost && handleNavigation(nextPost.slug)}
              disabled={!nextPost}
              title={nextPost?.title}
            >
              {t('nextPost')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}