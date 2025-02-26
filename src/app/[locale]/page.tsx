// pages/index.js
import { JetBrainsSearch } from '@/components/JetBrainsSearch';
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';
import { getCategoryMetaList } from '@/lib/data';
import { Link } from "@/lib/i18n"; // 修改导入方式
import { getSortedPostsData } from '@/lib/posts';

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
      {/* Hero Section，俏标题·引人入胜 */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container relative z-10 py-8 md:py-16">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="hero-text-gradient text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                AI·Affiliate
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-normal mt-4">
                {t('h2')}
              </h2>
              {/* 搜索框容器 */}
              <div className="max-w-2xl mx-auto mt-6 relative z-20">
                <JetBrainsSearch />
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
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

      {/* Showmaker Section，热门展区 */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t('popularToolsTitle') || 'Popular AI Tools'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 使用 JetBrains 风格的卡片渲染工具 */}
            {allPostsData.map((tool: any) => (
              <JetBrainsToolCard
                key={tool.title}
                name={tool.title || ''}
                description={tool.description || ''}
                url={tool.url || '#'}
                tags={tool.tags || []}
                icon_url={tool.icon_url || ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 分类区域 */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t('categoriesTitle') || 'AI Tools Categories'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* 使用 JetBrains 风格的卡片渲染分类 */}
            {categories.map((category: categoryType) => (
              <Link key={category.link} href={`/category/${category.link}`}>
                <div className="jetbrains-card h-full">
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}