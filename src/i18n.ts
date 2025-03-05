import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { appConfig } from "./lib/appConfig";

// Can be imported from a shared config
const locales = appConfig.i18n.locales;

/*
工作流程：
1. Next.js 启动时加载 `next.config.mjs`
2. 通过 `withNextIntl` 注入国际化支持
3. 当收到请求时：
   - 检查 URL 中的语言参数
   - 使用 `i18n.ts` 验证语言有效性
   - 加载对应的语言文件
   - 应用翻译到页面

这种配置实现了：
- 多语言路由支持
- 动态语言切换
- 图片资源安全加载
- 性能优化（字体、图片）
- 内容安全策略
 */

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});