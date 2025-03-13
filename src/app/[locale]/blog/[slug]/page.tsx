import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

async function getBlogPost(slug: string, locale: string) {
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
  params: { slug: string; locale: string }
}) {
  // 解码 URL 编码的 slug
  const decodedSlug = decodeURIComponent(slug);
  // console.log(`[${slug}]-->>>${decodedSlug}`);
  const content = await getBlogPost(decodedSlug, locale);

  if (!content) {
    notFound();
  }

  return (
    <BlogPostClient slug={decodedSlug} locale={locale} content={content} />
  );
}