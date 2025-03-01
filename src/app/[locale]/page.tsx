// pages/index.js
import { JetBrainsSearch } from '@/components/JetBrainsSearch';
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';
import { getCategoryMetaList } from '@/lib/data';
import { Link } from "@/lib/i18n"; // 修改导入方式
import { getSortedPostsData } from '@/lib/posts';
import { CategoryGrid } from '@/components/CategoryGrid';

import { getLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('home');
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

type categoryType = {
  name: string;
  src: string;
  description: string;
  link: string;
}

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('home');
  // categories data
  const categories = getCategoryMetaList(locale);

  const allPostsData = getSortedPostsData().slice(0, 6)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section，俏标题·引人入胜 - 增加内容间距 */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container relative z-10 py-8 md:py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="hero-text-gradient text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                AI·Affiliate
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-normal mt-6">
                {t('h2')}
              </h2>
              {/* 搜索框容器 - 增加最大宽度 */}
              <div className="max-w-3xl mx-auto mt-8 relative z-20">
                <JetBrainsSearch />
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
                {t('description')}
              </p>
            </div>
          </div>

          {/* 背景装饰 */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-background/5 backdrop-blur-3xl" />
          </div>
        </div>
      </section>

      {/* 分类区域 - 减少上下内边距 */}
      <section className="py-6">
        <div className="container">
          <CategoryGrid categories={categories} />
        </div>
      </section>
    </main>
  )
}