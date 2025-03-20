import { GoogleAnalyticsScript } from "@/components/analytics/GoogleAnalyticsScript";
import { PlausibleAnalyticsScript } from "@/components/analytics/PlausibleAnalyticsScript";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LanguageDetector from '@/components/LanguageDetector';
import { cn } from "@/lib/utils";
import '@radix-ui/themes/styles.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from "next-themes";
import { DM_Sans, Inter } from "next/font/google";
import Script from 'next/script';
import React from 'react';
import './globals.css';
import { appConfig } from "@/lib/appConfig";

// 全局字体设置
const inter = Inter({ subsets: ['latin'] })
const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// 网站元数据(SEO)
export async function generateMetadata({
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: `${appConfig.baseUrl}/${locale}`,
      languages: {
        "en-US": `${appConfig.baseUrl}/en`,
        "zh-CN": `${appConfig.baseUrl}/zh`,
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
              <Header />
              <LanguageDetector />
              {children}
              <Footer />
              {/* 布局结构 */}
              {/* 网站统计和广告脚本 */}
              {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
                <Script
                  async
                  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
                  strategy="afterInteractive"
                  crossOrigin="anonymous"
                />
              )}
              <GoogleAnalyticsScript />
              <PlausibleAnalyticsScript />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  )
}