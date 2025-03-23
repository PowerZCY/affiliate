import { MetadataRoute } from 'next'
import { appConfig } from "@/lib/appConfig";

// 强制静态生成
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.baseUrl
  const locales = appConfig.i18n.locales

  const routes = [
    // 主页面（各语言版本）
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0
    }))
  ]

  return routes
}
