import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import LanguageDetector from '@/components/LanguageDetector';
import { GoogleAnalyticsScript } from "@/components/script/GoogleAnalyticsScript";
import { appConfig } from "@/lib/appConfig";
import '@radix-ui/themes/styles.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from "next-themes";
import { Montserrat, DM_Sans } from "next/font/google";
import React from 'react';
import './globals.css';
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  weight: ['400'], // 400 是 Regular
  subsets: ['latin'],
  display: 'swap',
})
// 全局字体设置
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
    title: t('webTitle'),
    description: t('webDescription'),
    keywords: t('keywords'),
    metadataBase: new URL(appConfig.baseUrl),
    alternates: {
      canonical: `${appConfig.baseUrl}/${locale}`,
      languages: {
        "en": `${appConfig.baseUrl}/en`,
        "zh": `${appConfig.baseUrl}/zh`,
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
        <body className={cn(montserrat.className, sansFont.variable, )}>
          <NextIntlClientProvider messages={messages}>
            {/* 国际化支持 */}
            <ThemeProvider attribute="class">
              {/* 主题支持 */}
              <Header />
              <LanguageDetector />
              {children}
              <Footer />
              {/* 布局结构 */}
              <GoogleAnalyticsScript />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  )
}