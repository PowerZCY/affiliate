import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { appConfig } from '@/lib/appConfig';

async function getBlogPost(slug: string, locale: (typeof appConfig.i18n.locales)[number]) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'md', locale, `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    // 使用 gray-matter 解析 markdown 内容，分离 frontmatter 和正文
    const { content: markdown } = matter(content);
    return markdown;
  } catch (error) {
    console.error(`Failed to load blog content: ${locale}-${slug}`, error)
    return null;
  }
}

export default async function BlogPost({
  params: { slug, locale }
}: {
  params: {
    slug: string;
    locale: (typeof appConfig.i18n.locales)[number]
  }
}) {
  const decodedSlug = decodeURIComponent(slug);
  const content = await getBlogPost(decodedSlug, locale);

  if (!content) {
    notFound();
  }

  return (
    <BlogPostClient slug={decodedSlug} locale={locale} content={content} />
  );
}