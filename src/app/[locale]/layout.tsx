import GoogleAdsenseScript from "@/components/ads/GoogleAdsenseScript";
import { GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalyticsScript";
import { PlausibleAnalyticsScript } from "@/components/analytics/PlausibleAnalyticsScript";
import { Layout } from '@/components/Layout';
import { cn } from "@/lib/utils";
import '@radix-ui/themes/styles.css';
import { Metadata } from 'next';
import { ThemeProvider } from "next-themes";
import { DM_Sans, Inter } from "next/font/google";
import React from 'react';
import './globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// 全局字体设置
const inter = Inter({ subsets: ['latin'] })
const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 网站元数据(SEO)
export const metadata: Metadata = {
  title: {
    default: 'AI Affiliate: Open-Source & Hot AI Tools Navigator',
    template: '%s | AI Affiliate'
  },
  description: 'Embrace AI, explore the infinite possibilities of AI tools"',
  authors: { name: 'AI·Affiliate', url: 'http://localhost:3000/' },
  keywords: 'AI tools, AI tool',
  alternates: {
    canonical: "http://localhost:3000/", languages: {
      "en-US": "http://localhost:3000/en/",
      "zh-CN": "http://localhost:3000/zh/",
    }
  },
  icons: [
    { rel: "icon", type: 'image/png', sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "icon", type: 'image/png', sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "icon", type: 'image/ico', url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon-180x180.png" },
    { rel: "android-chrome", sizes: "512x512", url: "/favicon-512x512.png" },

  ],
}

// 网站根布局结构
export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <>
      <html lang={locale} suppressHydrationWarning>
        <head />
        <body className={cn(inter.className, sansFont.variable,
        )}>
          <NextIntlClientProvider messages={messages}>
            {/* 国际化支持 */}
            <ThemeProvider attribute="class">
              {/* 主题支持 */}
              <Layout>{children}</Layout>
              {/* 布局结构 */}

              {/* 网站统计和广告脚本 */}
              <GoogleAdsenseScript />
              <GoogleAnalyticsScript />
              <PlausibleAnalyticsScript />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  )
}