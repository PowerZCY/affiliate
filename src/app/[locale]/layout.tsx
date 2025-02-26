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

const inter = Inter({ subsets: ['latin'] })
const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: 'AI Affliate: Open-Source & Hot AI Tools Navigator',
    template: '%s | AI Affliate'
  },
  description: 'Explore Every Essential AI Tools You Need For Your Development Journey',
  authors: { name: 'AI·Affliate', url: 'http://localhost:3000/' },
  keywords: 'AI tools, AI tool, AI toolset',
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
            <ThemeProvider attribute="class">
              <Layout>{children}</Layout>
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