import React from 'react'; // 确保导入 React
import { getCategoryByLink, getToolList } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from "@/lib/i18n";
import { JetBrainsToolCard } from '@/components/JetBrainsToolCard';
import { Button } from '@/components/ui/button';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getTranslations, getLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params: { category } }: CategoryPageProps) {
  const t = await getTranslations('category');

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return {
    title: capitalize(category) + ' Developer Tools',
    description: t('meta_description'),
  }
}

type CategoryPageProps = {
  params: {
    category: string;
  };
}

export default async function Tool({ params: { category } }: CategoryPageProps) {
  const locale = await getLocale();
  const categoryData = getCategoryByLink(category, locale);
  const t = await getTranslations('category');

  if (!categoryData) {
    return notFound();
  }

  // 获取该分类下的工具列表
  const tools = getToolList(categoryData.src, locale);

  return (
    <main className="container py-12">
      {/* 面包屑导航 - JetBrains 风格 */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('homeBtn')}
        </Link>

        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-muted-foreground hover:text-foreground">
                {t('homeBtn')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/category" className="text-muted-foreground hover:text-foreground">
                {t('categoryBtn')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize font-medium">{categoryData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 页面标题 - JetBrains 风格 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
          {categoryData.name}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {categoryData.description}
        </p>
      </div>

      {/* 工具列表 - JetBrains 风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool: any) => (
          <JetBrainsToolCard
            key={tool.name}
            name={tool.name}
            description={tool.description}
            url={tool.url}
            tags={tool.tags}
            icon_url={tool.icon_url}
          />
        ))}
      </div>

      {/* 底部信息 - JetBrains 风格 */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-6">{t('h2description')}</p>
        <Link href="/article/add-new-developer-tools">
          <Button
            variant="jetbrains"
            className="rounded-full px-6"
          >
            {t('submitToolBtn') || '提交工具'}
          </Button>
        </Link>
      </div>
    </main>
  )
}