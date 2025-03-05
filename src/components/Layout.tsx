import React, { ReactNode } from 'react';
import { Navigation } from './Navigation'
import { Footer } from '@/components/Footer'
import { getCategoryMetaList } from '@/lib/data';
import { getLocale } from 'next-intl/server';

export async function Layout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  // categories data
  const categories: { name: string, src: string, description: string, link: string }[] = getCategoryMetaList(locale);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navigation categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}