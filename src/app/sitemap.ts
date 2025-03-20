import { appConfig } from "@/lib/appConfig";
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapRoutes: MetadataRoute.Sitemap = [
    {
      url: '', // home
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    }
  ];

  // 为每个支持的语言生成对应的路由
  const localeRoutes = sitemapRoutes.flatMap(route => {
    return appConfig.i18n.locales.map(locale => ({
      ...route,
      url: locale === appConfig.i18n.defaultLocale
        ? route.url
        : `${locale}/${route.url}`,
    }));
  });

  // 生成完整的 URL
  const sitemapData = localeRoutes.map(route => ({
    ...route,
    url: `${appConfig.baseUrl}/${route.url}`,
  }));

  return sitemapData;
}
