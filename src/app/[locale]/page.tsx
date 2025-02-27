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
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              AI·Affiliate
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t('h2')}
            </h2>

            {/* 添加搜索框 */}
            <div className="mb-8">
              <JetBrainsSearch />
            </div>

            <p className="text-lg mb-8">
              {t('description')}
            </p>
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