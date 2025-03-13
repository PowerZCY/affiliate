'use client';

import { useState } from 'react';
import { MarkdownRenderer, TableOfContents } from '@/components/MarkdownRenderer';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogFooter } from '@/components/blog/BlogFooter';
import { BlogSidebar } from '@/components/blog/BlogSidebar';

interface BlogPostClientProps {
  slug: string;
  locale: string;
  content: string;
}

export default function BlogPostClient({ slug, locale, content }: BlogPostClientProps) {
  const [toc, setToc] = useState<TableOfContents[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-12">
            <article className="bg-card rounded-lg shadow-lg overflow-hidden">
              <BlogHeader slug={slug} locale={locale} />
              <div className="p-8">
                <MarkdownRenderer
                  content={content}
                  onTocChange={setToc}
                />
              </div>

              <BlogFooter />
            </article>
          </main>
        </div>
      </div>

      <BlogSidebar toc={toc} />
    </div>
  );
} 